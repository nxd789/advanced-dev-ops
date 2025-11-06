from calc import add, mul

def test_add():
    "test add..."
    print("test add...")
    assert add(3,4) == 7

def test_mul():
    "test add..."
    print("test mul...")
    assert mul(3,4) == 12

if __name__ == "__main__":
    print("testing...")
    test_add()
    test_mul()
    print("done.")