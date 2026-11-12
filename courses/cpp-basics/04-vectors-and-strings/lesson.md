# Vectors and Strings

## std::vector

A resizable array. Include `<vector>`:

```cpp
vector<int> v = {10, 20, 30};
v.push_back(40);             // add to the end
cout << v.size() << endl;    // 4
cout << v[1] << endl;        // 20  (index starts at 0)

for (int x : v) {            // range-based for
    cout << x << endl;
}
```

- `v[i]` does **not** check the index. An out-of-range index is *undefined behavior*: it may print garbage or crash
- `v.at(i)` checks and throws an exception instead

---

## Strings

```cpp
string s = "Hello";
cout << s.size() << endl;      // 5   (also s.length())
s += " world";                 // join
cout << s[0] << endl;          // H
cout << s.substr(0, 5) << endl; // Hello
```

- You cannot add two string **literals**: `"a" + "b"` is an error. At least one side must be a `std::string`: `string("a") + "b"`
- Compare strings with `==`
- Use `to_string(42)` to turn a number into a string
