package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/travas-io/travas-op/internal"
)

func Routes(r *gin.Engine, srv internal.MainStore) {

	// middleware for logging error and recovery from panic
	router := r.Use(gin.Logger(), gin.Recovery())

	// Setup CORS configuration
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	config.AllowMethods = []string{"POST", "GET", "PUT", "DELETE"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization"}
	router.Use(cors.New(config))

	// Manage cookies data in session
	cookieData := cookie.NewStore([]byte("travas"))
	router.Use(sessions.Sessions("session", cookieData))

	// HTTP method , URL for each endpoint
	router.GET("/", srv.Welcome())
	router.GET("/register", srv.Register())
	router.POST("/register", srv.ProcessRegister())
	router.GET("/login", srv.LoginPage())
	router.POST("/login", srv.ProcessLogin())

	// Restricted HTTP method requests and URL to an endpoints

	authRouter := r.Group("/auth")
	authRouter.Use(Authorization())
	{
		// to verify uploaded document ---> not implemented yet
		authRouter.POST("/verify/credential", srv.VerifyDocument())
    authRouter.GET("/verify/status", srv.CheckStatus())

		// For operator to manage created tour packages
		authRouter.POST("/add/packages", srv.ProcessTourPackage())
		authRouter.POST("/add/packages/test", srv.TestTourPackage())
		authRouter.GET("/load/packages", srv.LoadTourPackage())

		// for Operator to manage tour guides
		authRouter.POST("/guide/add", srv.AddTourGuide())
		authRouter.GET("/guide/load", srv.GetTourGuide())
		authRouter.GET("/guide/select/assign", srv.SelectTourGuide())
		authRouter.DELETE("/guide/select/delete/:id", srv.DeleteTourGuide())
	}
}
