def test_import_promptly():
    try:
        import promptly
    except ImportError:
        assert False, "Could not import promptly package"
    assert True

def test_main_exists():
    import promptly
    assert hasattr(promptly, "main") or hasattr(promptly, "routes") or hasattr(promptly, "services"), "Main modules missing"
