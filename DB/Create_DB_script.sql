USE [master]
GO

/****** Object:  Database [Structural_Proof_System_DB]    Script Date: 19.10.2020 17:18:46 ******/
CREATE DATABASE [Structural_Proof_System_DB]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Structural_Proof_System_DB', FILENAME = N'D:\data\Structural_Proof_System_DB.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Structural_Proof_System_DB_log', FILENAME = N'D:\data\Structural_Proof_System_DB_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO

IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Structural_Proof_System_DB].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO

ALTER DATABASE [Structural_Proof_System_DB] SET ANSI_NULL_DEFAULT OFF 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET ANSI_NULLS OFF 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET ANSI_PADDING OFF 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET ANSI_WARNINGS OFF 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET ARITHABORT OFF 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET AUTO_CLOSE OFF 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET AUTO_SHRINK OFF 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET AUTO_UPDATE_STATISTICS ON 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET CURSOR_DEFAULT  GLOBAL 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET CONCAT_NULL_YIELDS_NULL OFF 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET NUMERIC_ROUNDABORT OFF 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET QUOTED_IDENTIFIER OFF 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET RECURSIVE_TRIGGERS OFF 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET  DISABLE_BROKER 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET TRUSTWORTHY OFF 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET PARAMETERIZATION SIMPLE 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET READ_COMMITTED_SNAPSHOT OFF 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET HONOR_BROKER_PRIORITY OFF 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET RECOVERY SIMPLE 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET  MULTI_USER 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET PAGE_VERIFY CHECKSUM  
GO

ALTER DATABASE [Structural_Proof_System_DB] SET DB_CHAINING OFF 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET DELAYED_DURABILITY = DISABLED 
GO

ALTER DATABASE [Structural_Proof_System_DB] SET QUERY_STORE = OFF
GO

ALTER DATABASE [Structural_Proof_System_DB] SET  READ_WRITE 
GO

USE [Structural_Proof_System_DB]
GO

/****** Object:  Table [dbo].[Users]    Script Date: 19.10.2020 17:19:57 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Users](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](25) NOT NULL,
	[Password] [nvarchar](32) NULL,
	[Age] [int] NOT NULL,
	[Avatar] [nvarchar](max) NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

USE [Structural_Proof_System_DB]
GO

/****** Object:  StoredProcedure [dbo].[DeleteUserById]    Script Date: 19.10.2020 17:20:20 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[DeleteUserById]
	@Id uniqueidentifier
AS
BEGIN
	SET NOCOUNT OFF;

	DELETE 
	FROM Users
	WHERE Id = @Id
END
GO

USE [Structural_Proof_System_DB]
GO

/****** Object:  StoredProcedure [dbo].[GetAllUsers]    Script Date: 19.10.2020 17:20:37 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[GetAllUsers] 
	
AS
BEGIN
	SET NOCOUNT ON;

	SELECT * FROM Users
END
GO

USE [Structural_Proof_System_DB]
GO

/****** Object:  StoredProcedure [dbo].[GetUserById]    Script Date: 19.10.2020 17:20:54 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[GetUserById]
	@Id uniqueidentifier
AS
BEGIN
	SET NOCOUNT ON;

	SELECT * 
	FROM Users
	Where Id = @Id
END
GO

USE [Structural_Proof_System_DB]
GO

/****** Object:  StoredProcedure [dbo].[GetUserByName]    Script Date: 19.10.2020 17:21:07 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[GetUserByName]
	@Name nvarchar(25)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT TOP 1 * 
	FROM Users
	Where Name = @Name
END
GO

USE [Structural_Proof_System_DB]
GO

/****** Object:  StoredProcedure [dbo].[IsRegistered]    Script Date: 19.10.2020 17:21:25 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[IsRegistered]
	@Name nvarchar(25),
	@Password nvarchar(32)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT COUNT(*)
	FROM Users
	WHERE Name = @Name AND Password = @Password
END
GO

USE [Structural_Proof_System_DB]
GO

/****** Object:  StoredProcedure [dbo].[SaveUser]    Script Date: 19.10.2020 17:21:43 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[SaveUser]
	@Id uniqueidentifier,
	@Name nvarchar(25),
	@Password nvarchar(32) = NULL,
	@Age int,
	@Avatar nvarchar(MAX) = NULL
AS
BEGIN
	SET NOCOUNT OFF;

	INSERT INTO Users (Id, Name, Password, Age, Avatar)
	VALUES (@Id, @Name, @Password, @Age, @Avatar)
END
GO

USE [Structural_Proof_System_DB]
GO

/****** Object:  StoredProcedure [dbo].[SetPassword]    Script Date: 19.10.2020 17:21:57 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[SetPassword]
	@Id uniqueidentifier,
	@Password nvarchar(32)
AS
BEGIN
	SET NOCOUNT OFF;

	UPDATE Users
	SET Password = @Password
	WHERE Id = @Id
END
GO

USE [Structural_Proof_System_DB]
GO

/****** Object:  StoredProcedure [dbo].[UpdateUser]    Script Date: 19.10.2020 17:22:09 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[UpdateUser]
	@Id uniqueidentifier,
	@Name nvarchar(25),
	@Password nvarchar(32) = NULL,
	@Age int,
	@Avatar nvarchar(MAX) = NULL
AS
BEGIN
	SET NOCOUNT OFF;

	UPDATE Users
	SET Name = @Name, Password = @Password, Age = @Age, Avatar = @Avatar
	WHERE Id = @Id
END
GO

