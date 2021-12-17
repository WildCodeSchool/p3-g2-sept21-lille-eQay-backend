-- MySQL dump 10.13  Distrib 8.0.27, for Linux (x86_64)
--
-- Host: localhost    Database: eQAI
-- ------------------------------------------------------
-- Server version	8.0.27-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `mesures`
--

DROP TABLE IF EXISTS `mesures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mesures` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` int DEFAULT NULL,
  `aqi` decimal(6,3) DEFAULT NULL,
  `pm1` decimal(6,3) DEFAULT NULL,
  `pm10` decimal(6,3) DEFAULT NULL,
  `pm25` decimal(6,3) DEFAULT NULL,
  `ppm` decimal(6,3) DEFAULT NULL,
  `humidity` decimal(6,3) DEFAULT NULL,
  `temperature` decimal(6,3) DEFAULT NULL,
  `adresses_latitude` float(17,8) NOT NULL,
  `adresses_longitude` float(17,8) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_mesures_adresses_idx` (`adresses_longitude`,`adresses_latitude`),
  CONSTRAINT `fk_mesures_adresses` FOREIGN KEY (`adresses_longitude`, `adresses_latitude`) REFERENCES `adresses` (`longitude`, `latitude`)
) ENGINE=InnoDB AUTO_INCREMENT=2074 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-12-16 15:34:17
