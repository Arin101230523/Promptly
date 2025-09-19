def test_fastapi_app_exists():
    try:
        import promptly.main
    except ImportError:
        assert False, "Could not import promptly.main"
    from fastapi import FastAPI
    assert isinstance(promptly.main.app, FastAPI), "app is not a FastAPI instance"
