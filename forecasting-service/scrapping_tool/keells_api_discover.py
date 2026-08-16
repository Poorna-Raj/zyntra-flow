def discover_departmen_endpoints(
    cookie: Optional[str] = None,
    user_session_id: Optional[str] = None,
    timeout: int = 15,
) -> dict:
    """Best-effort probe for a menu/category-tree endpoint alongside
    GetItemDetails, so you don't have to click through every category by
    hand in DevTools to find departmentId values.

    Tries several plausible candidate endpoint names used by similar
    WebV2-style storefront APIs and reports which ones respond with
    something other than a 404/empty body. Inspect the returned dict
    yourself - whichever key has real category/department data in its
    'preview' is the one to build a proper parser around.
    """
    cookie = cookie or os.environ.get("KEELLS_COOKIE", "")
    if not cookie:
        raise RuntimeError("Set KEELLS_COOKIE first (see module docstring).")

    root = "https://zebraliveback.keellssuper.com/2.0/WebV2/"
    candidates = [
        "GetDepartments",
        "GetDepartmentList",
        "GetMenu",
        "GetCategoryTree",
        "GetCategories",
        "GetSubDepartments",
        "GetOutletDepartments",
    ]

    headers = _build_headers(cookie, user_session_id)
    results = {}
    for name in candidates:
        url = root + name
        try:
            resp = requests.get(url, headers=headers, timeout=timeout)
        except requests.RequestException as e:
            results[name] = {"error": str(e)}
            continue

        entry = {"status_code": resp.status_code}
        if resp.status_code == 200:
            try:
                body = resp.json()
                entry["preview"] = str(body)[:500]
            except ValueError:
                entry["preview"] = resp.text[:200]
        results[name] = entry
        print(f"[keells] probe {name}: {resp.status_code}")
        time.sleep(random.uniform(0.8, 1.5))

    return results