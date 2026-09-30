.PHONY: setup run migrate

setup:
	python3 -m venv .venv
	.venv/bin/pip install -r requirements.txt

run:
	.venv/bin/uvicorn server.app:app --host 0.0.0.0 --port 8000

migrate:
	.venv/bin/python -m server.migrate
