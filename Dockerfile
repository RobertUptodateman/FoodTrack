FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY . .
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./backend/cmd/web

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .
COPY --from=builder /app/frontend ./frontend

ENV PATH_TO_STATIC="frontend"
EXPOSE 8080
CMD ["./main"]
