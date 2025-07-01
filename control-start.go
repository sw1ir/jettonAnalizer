package main

import (
	"fmt"
	"html/template"
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
		port = "3000"
		fmt.Println("Успешно запущено на http://localhost:3000/")
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
	http.ListenAndServe(":"+port, mux)

}
