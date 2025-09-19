def test_agent_service_import():
    try:
        from promptly.services import agent_service
    except ImportError:
        assert False, "Could not import agent_service module"
    assert True

def test_agent_service_has_expected_functions():
    from promptly.services import agent_service
    assert hasattr(agent_service, "AgentService") or hasattr(agent_service, "some_function"), "AgentService class or function missing"
