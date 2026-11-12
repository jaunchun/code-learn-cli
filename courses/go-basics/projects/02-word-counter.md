---
title: Word Counter
difficulty: medium
time: about 2-3 hours
skills: maps, slices, sorting, files, strings package
---
## What you'll build

A program that reads a text file and prints the most common words.

```text
$ go run main.go notes.txt
the     12
go       7
and      5
```

## Requirements

- Take the file name from the command line (`os.Args[1]`)
- Count words ignoring case and punctuation
- Print the top 10, most frequent first (ties in alphabetical order)
- Print a helpful error if the file cannot be read

---

## Steps

1. Read the file and split it into words:

```go
data, err := os.ReadFile(os.Args[1])
if err != nil {
    fmt.Println("error:", err)
    os.Exit(1)
}
words := strings.Fields(strings.ToLower(string(data)))
```

2. Clean each word and count it in a `map[string]int`:

```go
counts := map[string]int{}
for _, w := range words {
    w = strings.Trim(w, ".,;:!?\"'()")
    if w != "" {
        counts[w]++
    }
}
```

3. Maps have no order. Copy the entries into a slice of structs and sort it:

```go
type entry struct {
    word  string
    count int
}
var list []entry
for w, n := range counts {
    list = append(list, entry{w, n})
}
sort.Slice(list, func(i, j int) bool {
    if list[i].count != list[j].count {
        return list[i].count > list[j].count
    }
    return list[i].word < list[j].word
})
```

## Stretch goals

- Add a `-n` flag for the number of words (`flag` package)
- Count lines and characters as well
- Read from standard input when no file is given
- Process several files at once with goroutines
