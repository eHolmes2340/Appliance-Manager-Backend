-- MySQL dump 10.13  Distrib 9.2.0, for macos15 (arm64)
--
-- Host: localhost    Database: applianceManager
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary view structure for view `last5recalls`
--

CREATE DATABASE IF NOT EXISTS applianceManager;
USE applianceManager;

DROP TABLE IF EXISTS `last5recalls`;
/*!50001 DROP VIEW IF EXISTS `last5recalls`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `last5recalls` AS SELECT 
 1 AS `id`,
 1 AS `recall_date`,
 1 AS `recall_heading`,
 1 AS `product_name`,
 1 AS `description`,
 1 AS `hazard_description`,
 1 AS `consumer_action`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `type` enum('warranty_expiry','appliance_recall') NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `applianceId` int DEFAULT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `isRead` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `usersInformation` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recalls`
--

DROP TABLE IF EXISTS `recalls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recalls` (
  `id` int NOT NULL AUTO_INCREMENT,
  `recall_date` varchar(50) DEFAULT NULL,
  `safety_warning_date` varchar(50) DEFAULT NULL,
  `recall_heading` text,
  `product_name` text,
  `description` text,
  `hazard_description` text,
  `consumer_action` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recalls`
--

LOCK TABLES `recalls` WRITE;
/*!40000 ALTER TABLE `recalls` DISABLE KEYS */;
/*!40000 ALTER TABLE `recalls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userAppliances`
--

DROP TABLE IF EXISTS `userAppliances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userAppliances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `applianceName` varchar(255) DEFAULT NULL,
  `applianceType` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `warrantyExpirationDate` date DEFAULT NULL,
  `applianceImageURL` text,
  `manualURL` text,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `userappliances_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `usersInformation` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userAppliances`
--

LOCK TABLES `userAppliances` WRITE;
/*!40000 ALTER TABLE `userAppliances` DISABLE KEYS */;
INSERT INTO `userAppliances` VALUES (1,15,'washer','Kitchen','Maytag ',NULL,NULL,'https://firebasestorage.googleapis.com/v0/b/appliance-manager-a042c.firebasestorage.app/o/appliance_images%2F1743984265673?alt=media&token=cb861ce1-bfd3-45e5-9d82-2fdf12657bf1',NULL),(2,15,'dryer','Laundry','whirlpool',NULL,NULL,'https://firebasestorage.googleapis.com/v0/b/appliance-manager-a042c.firebasestorage.app/o/appliance_images%2F1743984300339?alt=media&token=cd6980bc-0860-4bff-a199-f5f609e52e01','https://www.manualslib.com/manual/2195132/Whirlpool-Wed5010lw.html'),(4,15,'Mac','Kitchen','apple','air',NULL,'https://firebasestorage.googleapis.com/v0/b/appliance-manager-a042c.firebasestorage.app/o/appliance_images%2F1743987859984?alt=media&token=a0ee2f1b-54c0-4215-9da7-deaf201e1066',NULL);
/*!40000 ALTER TABLE `userAppliances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usersInformation`
--

DROP TABLE IF EXISTS `usersInformation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usersInformation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `postalCode` varchar(20) NOT NULL,
  `country` varchar(100) NOT NULL,
  `freeAccount` tinyint(1) NOT NULL,
  `accountVerified` tinyint(1) NOT NULL,
  `notificationsEnabled` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usersInformation`
--

LOCK TABLES `usersInformation` WRITE;
/*!40000 ALTER TABLE `usersInformation` DISABLE KEYS */;
INSERT INTO `usersInformation` VALUES (15,'test','set','test@gmail.com','N0B 2T0','Canada',1,0,1);
/*!40000 ALTER TABLE `usersInformation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `last5recalls`
--

/*!50001 DROP VIEW IF EXISTS `last5recalls`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */

/*!50001 VIEW `last5recalls` AS select max(`recalls`.`id`) AS `id`,`recalls`.`recall_date` AS `recall_date`,`recalls`.`recall_heading` AS `recall_heading`,`recalls`.`product_name` AS `product_name`,`recalls`.`description` AS `description`,`recalls`.`hazard_description` AS `hazard_description`,`recalls`.`consumer_action` AS `consumer_action` from `recalls` group by `recalls`.`recall_heading`,`recalls`.`recall_date`,`recalls`.`product_name`,`recalls`.`description`,`recalls`.`hazard_description`,`recalls`.`consumer_action` order by str_to_date(`recalls`.`recall_date`,'%M %d, %Y') desc,`id` desc limit 5 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-07 10:26:51
