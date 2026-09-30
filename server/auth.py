import base64
import hashlib
import hmac
import json
import time

from fastapi import HTTPException, Request

from server.config import Settings

TOKEN_TTL = 12 * 60 * 60


def _b64(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).decode().rstrip("=")


def _b64_decode(raw: str) -> bytes:
    pad = "=" * (-len(raw) % 4)
    return base64.urlsafe_b64decode(raw + pad)


def issue_token(settings: Settings, username: str) -> str:
    payload = {"sub": username, "exp": int(time.time()) + TOKEN_TTL}
    body = _b64(json.dumps(payload, separators=(",", ":")).encode())
    sig = hmac.new(settings.jwt_secret.encode(), body.encode(), hashlib.sha256).hexdigest()
    return f"{body}.{sig}"


def _same(left: str, right: str) -> bool:
    return hmac.compare_digest(
        hashlib.sha256(left.encode()).digest(),
        hashlib.sha256(right.encode()).digest(),
    )


def _valid_jwt(settings: Settings, token: str) -> bool:
    if token.count(".") != 1:
        return False
    body, sig = token.split(".", 1)
    expected = hmac.new(settings.jwt_secret.encode(), body.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, sig):
        return False
    try:
        payload = json.loads(_b64_decode(body))
    except (json.JSONDecodeError, ValueError):
        return False
    if payload.get("sub") != settings.admin_user:
        return False
    exp = payload.get("exp")
    return isinstance(exp, int) and exp >= int(time.time())


def require_admin(request: Request, settings: Settings) -> None:
    cookie = request.cookies.get("oz_session", "")
    if cookie and _valid_jwt(settings, cookie):
        return
    auth = request.headers.get("authorization", "")
    if auth.lower().startswith("bearer ") and _valid_jwt(settings, auth[7:].strip()):
        return
    raise HTTPException(status_code=401, detail="No autorizado")


def check_password(settings: Settings, username: str, password: str) -> bool:
    return _same(username, settings.admin_user) and _same(password, settings.admin_password)
