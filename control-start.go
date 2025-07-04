package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
)

var tpl = template.Must(template.ParseFiles("index.html"))

func indexHandler(w http.ResponseWriter, r *http.Request) {
	tpl.Execute(w, nil)
}
func main() {
	port := os.Getenv("PORT")
	if port == "" {
		fmt.Print("Введите свободный порт: ")
		_, err := fmt.Scan(&port)
		if err != nil {
			log.Fatal("Ошибка ввода порта:", err)
		}
	}

	mux := http.NewServeMux()

	html := http.FileServer(http.Dir("html"))
	mux.Handle("/html/", http.StripPrefix("/html/", html))

	src := http.FileServer(http.Dir("src"))
	mux.Handle("/src/", http.StripPrefix("/src/", src))

	style := http.FileServer(http.Dir("style"))
	mux.Handle("/style/", http.StripPrefix("/style/", style))

	js := http.FileServer(http.Dir("js"))
	mux.Handle("/js/", http.StripPrefix("/js/", js))

	mux.HandleFunc("/", indexHandler)

	log.Printf("Сервер запущен на http://localhost:%s", port)
	fmt.Println("чтобы остановить сервер зажмите ctrl + c")
	log.Fatal(http.ListenAndServe(":"+port, mux))
}
