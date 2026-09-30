import os
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load_dotenv() -> None:
    env_path = ROOT / ".env"
    if not env_path.is_file():
        return
    for raw in env_path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip("'").strip('"')
        if key and key not in os.environ:
            os.environ[key] = value


def _need(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        raise RuntimeError(f"Falta {name} en el entorno o en .env")
    return value


@dataclass(frozen=True)
class Settings:
    admin_user: str
    admin_password: str
    jwt_secret: str
    api_key: str
    db_file: Path
    embed_url: str
    site_url: str
    static_dir: Path
    host: str
    port: int


def load_settings() -> Settings:
    load_dotenv()
    db_raw = os.environ.get("DB_FILE", "data/blog.sqlite").strip()
    db_file = Path(db_raw)
    if not db_file.is_absolute():
        db_file = ROOT / db_file
    static_raw = os.environ.get("STATIC_DIR", "dist").strip()
    static_dir = Path(static_raw)
    if not static_dir.is_absolute():
        static_dir = ROOT / static_dir
    return Settings(
        admin_user=_need("ADMIN_USER"),
        admin_password=_need("ADMIN_PASSWORD"),
        jwt_secret=_need("JWT_SECRET"),
        api_key=_need("ADMIN_API_KEY"),
        db_file=db_file,
        embed_url=os.environ.get("EMBED_URL", "https://embed.ozkr.net").rstrip("/"),
        site_url=os.environ.get("SITE_URL", "https://ozkar.co").rstrip("/"),
        static_dir=static_dir,
        host=os.environ.get("HOST", "0.0.0.0"),
        port=int(os.environ.get("PORT", "8000")),
    )
