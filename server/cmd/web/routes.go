package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/travas-io/travas-op/internal/controller"
)

func Routes(r *gin.Engine, o controller.Operator) {
	r.MaxMultipartMemory = 10 << 20
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
	router.GET("/", o.Welcome())
	router.GET("/register", o.Register())
	router.POST("/register", o.ProcessRegister())
	router.GET("/login", o.LoginPage())
	router.POST("/login", o.ProcessLogin())

	authRouter := r.Group("/auth")
	// Restricted HTTP method requests and URL to an endpoints
	authRouter.Use(Authorization())
	{
		// to verify uploaded document ---> not implemented yet
		authRouter.POST("/verify/documents", o.VerifyDocument())

		// For operator to manage created tour packages
		authRouter.POST("/add/packages", o.ProcessTourPackage())
		authRouter.POST("/add/packages/test", o.TestTourPackage())
		authRouter.GET("/load/packages", o.LoadTourPackage())

		// for Operator to manage tour guides
		authRouter.POST("/guide/add", o.AddTourGuide())
		authRouter.GET("/guide/load", o.GetTourGuide())
		authRouter.GET("/guide/select/assign", o.SelectTourGuide())
		authRouter.POST("/guide/select/delete/:id", o.DeleteTourGuide())
	}
}
