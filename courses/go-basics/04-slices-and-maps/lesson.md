# Slices and Maps

## Slices

A slice is a resizable list. (Arrays have a fixed size and are rarely used directly.)

```go
nums := []int{10, 20, 30}
fmt.Println(nums[1])         // 20
nums = append(nums, 40)      // append RETURNS the new slice
fmt.Println(len(nums))       // 4
fmt.Println(nums[1:3])       // [20 30]  (slice of a slice)

for i, v := range nums {     // index and value
    fmt.Println(i, v)
}
```

- `for _, v := range nums` ignores the index with `_`. Go insists that every variable is used
- `make([]int, 5)` creates a slice of 5 zeros

---

## Maps

Key-value pairs:

```go
ages := map[string]int{"ana": 30, "bo": 25}
ages["cy"] = 41
fmt.Println(ages["ana"])     // 30
fmt.Println(ages["zed"])     // 0   (missing key gives the zero value)

v, ok := ages["zed"]         // ok tells you if the key existed
delete(ages, "bo")

for name, age := range ages {  // order is random!
    fmt.Println(name, age)
}
```
