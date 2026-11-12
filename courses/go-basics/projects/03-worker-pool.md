---
title: Concurrent Worker Pool
difficulty: hard
time: about 4-5 hours
skills: goroutines, channels, sync.WaitGroup, structs
---
## What you'll build

A program that processes a list of jobs with several workers running **at the same time** (concurrency is Go's superpower).

```text
worker 2 started job 1
worker 1 started job 2
worker 3 started job 3
worker 2 finished job 1 -> 1
...
total: 385
```

## Requirements

- A list of jobs (for example the numbers 1 to 10); each job is "square this number" and takes a short pretend delay (`time.Sleep`)
- 3 workers read jobs from a channel and send results to another channel
- Collect all results and print their sum
- Use a `sync.WaitGroup` to know when the workers are done, and close the channels correctly

---

## Steps

1. A worker is a function that loops over the jobs channel:

```go
func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
    defer wg.Done()
    for j := range jobs {
        fmt.Printf("worker %d started job %d\n", id, j)
        time.Sleep(100 * time.Millisecond)
        results <- j * j
    }
}
```

2. In `main`: make the channels, start the workers with `go worker(...)`, send the jobs, then `close(jobs)` so the workers' loops end.
3. Wait for the workers in a separate goroutine and close `results` when they are done:

```go
go func() {
    wg.Wait()
    close(results)
}()
for r := range results {
    total += r
}
```

4. Run it with `go run -race main.go` to check for data races.

## Stretch goals

- Make the number of workers a command-line flag
- Use a struct for jobs and results (id, input, output)
- Add a timeout with `select` and `time.After`
- Replace the fake work with real HTTP requests (`net/http`) and check several URLs at once
