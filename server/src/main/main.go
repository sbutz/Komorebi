package main

import (
	"flag"
	"github.com/gorilla/context"
	"github.com/gorilla/securecookie"
	"github.com/gorilla/sessions"
	"komorebi"
	"log"
	"net/http"
	"os"
	"time"
)

var (
	Version   string
	BuildTime string
)

func main() {

	port := flag.String("port", "8080", "Listening port")
	logfile := flag.String("logfile", "", "Logfile (default stdout)")
	dump := flag.Bool("dump", false, "Dump stories, make a snapshot")
	clear_board := flag.String("clear", "", "Clears dump from given board")
	flag.StringVar(&komorebi.PublicDir, "publicdir", "public/", "Public directory")
	flag.StringVar(&komorebi.HookDir, "hookdir", "hooks/", "Directory for hooks")

	flag.Parse()

	if len(*logfile) > 0 {
		f, err := os.OpenFile(*logfile, os.O_APPEND|os.O_CREATE|os.O_RDWR, 0666)
		if err != nil {
			log.Printf("error opening logfile: %v", err)
		}
		defer f.Close()
		komorebi.Logger = log.New(f, "komorebi:", log.Lmicroseconds)
	} else {
		komorebi.Logger = log.New(os.Stdout, "komorebi:", log.Lmicroseconds)
	}

	komorebi.Logger.Printf("starting ")

	db := komorebi.InitDb("komorebi.db")
	db.AddTable(komorebi.Board{}, "boards")
	db.AddTable(komorebi.Column{}, "columns")
	db.AddTable(komorebi.User{}, "users")
	db.AddTable(komorebi.Task{}, "tasks")
	db.AddTable(komorebi.Dump{}, "dumps")
	db.AddTable(komorebi.BoardUsers{}, "board_users")
	db.AddTable(komorebi.TaskUsers{}, "task_users")
	db.AddTable(komorebi.DodTemplate{}, "dod_templates")
	db.AddTable(komorebi.Dod{}, "dods")
	tableMap := db.AddTable(komorebi.Story{}, "stories")
	tableMap.ColMap("Desc").SetMaxSize(1024)
	tableMap.ColMap("Requirements").SetMaxSize(1024)
	db.CreateTables()

	if *dump {
		komorebi.Logger.Printf("Dump tasks")
		komorebi.DumpIt()
		os.Exit(0)
	}
	if len(*clear_board) > 0 {
		komorebi.Logger.Printf("Clear dump for board", *clear_board)
		komorebi.ClearDump(*clear_board)
		os.Exit(0)
	}
	komorebi.SessionStore = sessions.NewCookieStore(securecookie.GenerateRandomKey(64))
	komorebi.SessionStore.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   60 * 60 * 24 * 7,
		Secure:   false,
		HttpOnly: true,
	}

	komorebi.FailedLoginCount = make(map[string]int)

	ticker := time.NewTicker(time.Hour * 24)
	go func() {
		for _ = range ticker.C {

			// Clear FailedLoginCount
			komorebi.FailedLoginCount = make(map[string]int)

			weekday := time.Now().Weekday().String()
			if weekday == "Sunday" || weekday == "Saturday" {
				komorebi.Logger.Printf("Skip periodic task dump")
				continue
			}
			komorebi.Logger.Printf("Periodic task dump")
			komorebi.DumpIt()
		}
	}()

	router := komorebi.NewRouter()
	log.Fatal(http.ListenAndServe(":"+*port, context.ClearHandler(router)))
}
