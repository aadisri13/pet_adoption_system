-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: pet_adoption_system
-- ------------------------------------------------------
-- Server version	8.0.33

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
-- Table structure for table `adopter`
--

DROP TABLE IF EXISTS `adopter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adopter` (
  `adopter_id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `dob` date DEFAULT NULL,
  `nationality` varchar(100) DEFAULT NULL,
  `govt_id` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `zipcode` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`adopter_id`),
  UNIQUE KEY `govt_id` (`govt_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adopter`
--

LOCK TABLES `adopter` WRITE;
/*!40000 ALTER TABLE `adopter` DISABLE KEYS */;
INSERT INTO `adopter` VALUES (1,'Adit','Srivastava','1995-04-15','Indian','ID1001','adit.srivastava@gmail.com','Bangalore','Karnataka','India','560001'),(2,'Aditya','Ashtaputre','1990-07-22','Indian','ID1002','aditya.ashtaputre@gmail.com','Mumbai','Maharashtra','India','400001'),(3,'Anirudha','Rao','1998-12-10','Indian','ID1003','anirudha.rao@gmail.com','Delhi','Delhi','India','110001'),(4,'Adithya','Beldar','1988-03-08','Indian','ID1004','adithya.beldar@gmail.com','Chennai','Tamil Nadu','India','600001'),(5,'Vaibhav ','Sharma','2001-02-13','indian','aadhar','vaibhavsharma1@gmail.com','delhi',NULL,'india','201305'),(7,'adit ','sharma','2025-11-12','india','aadhar1','yashkuberkhanna1016@gmail.com','Noida',NULL,'India','201301');
/*!40000 ALTER TABLE `adopter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `adoption_application`
--

DROP TABLE IF EXISTS `adoption_application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adoption_application` (
  `app_no` int NOT NULL AUTO_INCREMENT,
  `adopter_id` int NOT NULL,
  `pet_id` int NOT NULL,
  `status` enum('pending','approved','rejected','withdrawn') NOT NULL DEFAULT 'pending',
  `app_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `app_fee` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`app_no`),
  UNIQUE KEY `ux_adopter_pet` (`adopter_id`,`pet_id`),
  KEY `pet_id` (`pet_id`),
  CONSTRAINT `adoption_application_ibfk_1` FOREIGN KEY (`adopter_id`) REFERENCES `adopter` (`adopter_id`) ON DELETE CASCADE,
  CONSTRAINT `adoption_application_ibfk_2` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`pet_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adoption_application`
--

LOCK TABLES `adoption_application` WRITE;
/*!40000 ALTER TABLE `adoption_application` DISABLE KEYS */;
INSERT INTO `adoption_application` VALUES (5,1,1,'approved','2025-10-14 05:02:45',500.00),(6,2,2,'approved','2025-10-14 05:02:45',400.00),(7,3,3,'approved','2025-10-14 05:02:45',0.00),(8,4,4,'approved','2025-10-14 05:02:45',600.00),(9,1,3,'rejected','2025-11-10 19:37:34',50.00),(10,3,24,'approved','2025-11-10 19:57:10',50.00),(11,5,22,'rejected','2025-11-10 20:32:21',50.00),(12,2,23,'approved','2025-11-11 05:30:14',20.00),(13,3,22,'approved','2025-11-12 08:22:47',50.00),(14,7,21,'approved','2025-11-12 08:26:00',400.00),(15,1,20,'pending','2025-11-26 10:00:51',50.00);
/*!40000 ALTER TABLE `adoption_application` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_adoption_before_insert` BEFORE INSERT ON `adoption_application` FOR EACH ROW BEGIN
    DECLARE pstatus VARCHAR(32);
    
    -- Get pet status
    SELECT status INTO pstatus
    FROM pet
    WHERE pet_id = NEW.pet_id;
    
    -- Check if pet exists
    IF pstatus IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Pet not found for application';
    END IF;
    
    -- Block if pet is already adopted
    IF pstatus = 'adopted' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Pet is already adopted and cannot have new applications';
    ELSEIF pstatus <> 'available' AND pstatus <> 'pending' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Pet is not available for adoption';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_adoption_after_update` AFTER UPDATE ON `adoption_application` FOR EACH ROW BEGIN
  -- Only act when status changes to approved
  IF NEW.status = 'approved' AND OLD.status <> NEW.status THEN
    -- Mark the pet adopted
    UPDATE pet
    SET status = 'adopted'
    WHERE pet_id = NEW.pet_id;

    -- Decrement shelter occupancy safely
    UPDATE shelter s
    JOIN pet p ON p.shelter_id = s.shelter_id
    SET s.current_occupancy = GREATEST(0, s.current_occupancy - 1)
    WHERE p.pet_id = NEW.pet_id;
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `buys`
--

DROP TABLE IF EXISTS `buys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buys` (
  `adopter_id` int NOT NULL,
  `txn_id` int NOT NULL,
  PRIMARY KEY (`adopter_id`,`txn_id`),
  KEY `txn_id` (`txn_id`),
  CONSTRAINT `buys_ibfk_1` FOREIGN KEY (`adopter_id`) REFERENCES `adopter` (`adopter_id`) ON DELETE CASCADE,
  CONSTRAINT `buys_ibfk_2` FOREIGN KEY (`txn_id`) REFERENCES `transactions` (`txn_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buys`
--

LOCK TABLES `buys` WRITE;
/*!40000 ALTER TABLE `buys` DISABLE KEYS */;
INSERT INTO `buys` VALUES (1,1),(2,2),(3,3),(4,4);
/*!40000 ALTER TABLE `buys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `emp_id` int NOT NULL AUTO_INCREMENT,
  `shelter_id` int DEFAULT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `hire_date` date DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `salary` decimal(12,2) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`emp_id`),
  KEY `shelter_id` (`shelter_id`),
  CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`shelter_id`) REFERENCES `shelter` (`shelter_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,1,'Ravi','Kumar','2021-02-10','Caretaker',30000.00,'password123'),(2,2,'Priya','Menon','2020-07-05','Veterinarian',55000.00,'password123'),(3,3,'Amit','Singh','2019-11-22','Trainer',40000.00,'password123'),(4,4,'Neha','Verma','2022-05-14','Manager',60000.00,'password123');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `includes`
--

DROP TABLE IF EXISTS `includes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `includes` (
  `service_id` int NOT NULL,
  `product_id` int NOT NULL,
  PRIMARY KEY (`service_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `includes_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `service` (`service_id`) ON DELETE CASCADE,
  CONSTRAINT `includes_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `includes`
--

LOCK TABLES `includes` WRITE;
/*!40000 ALTER TABLE `includes` DISABLE KEYS */;
INSERT INTO `includes` VALUES (1,1),(2,2),(3,3),(4,4);
/*!40000 ALTER TABLE `includes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medical_record`
--

DROP TABLE IF EXISTS `medical_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_record` (
  `record_no` int NOT NULL AUTO_INCREMENT,
  `pet_id` int NOT NULL,
  `checkup_date` date NOT NULL,
  `vet_name` varchar(255) DEFAULT NULL,
  `next_due_date` date DEFAULT NULL,
  PRIMARY KEY (`record_no`),
  KEY `pet_id` (`pet_id`),
  CONSTRAINT `medical_record_ibfk_1` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`pet_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medical_record`
--

LOCK TABLES `medical_record` WRITE;
/*!40000 ALTER TABLE `medical_record` DISABLE KEYS */;
INSERT INTO `medical_record` VALUES (1,1,'2024-02-12','Dr. Priya Menon','2025-02-12'),(2,2,'2024-03-01','Dr. Ravi Kumar','2025-03-01'),(3,3,'2024-04-22','Dr. Amit Singh','2025-04-22'),(4,4,'2024-05-10','Dr. Neha Verma','2025-05-10');
/*!40000 ALTER TABLE `medical_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pet`
--

DROP TABLE IF EXISTS `pet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pet` (
  `pet_id` int NOT NULL AUTO_INCREMENT,
  `shelter_id` int NOT NULL,
  `name` varchar(200) NOT NULL,
  `species` varchar(100) NOT NULL,
  `dob` date DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `breed` varchar(100) DEFAULT NULL,
  `status` enum('available','adopted','in_treatment','reserved') NOT NULL DEFAULT 'available',
  PRIMARY KEY (`pet_id`),
  KEY `shelter_id` (`shelter_id`),
  CONSTRAINT `pet_ibfk_1` FOREIGN KEY (`shelter_id`) REFERENCES `shelter` (`shelter_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pet`
--

LOCK TABLES `pet` WRITE;
/*!40000 ALTER TABLE `pet` DISABLE KEYS */;
INSERT INTO `pet` VALUES (1,1,'Buddy','Dog','2020-06-01','Male','Labrador','adopted'),(2,1,'Mittens','Cat','2021-03-12','Female','Siamese','adopted'),(3,2,'Rocky','Dog','2019-09-22','Male','German Shepherd','adopted'),(4,3,'Snowy','Rabbit','2022-01-15','Female','Dutch','adopted'),(5,1,'Buddy','Dog','2022-01-10','Male','Golden Retriever','available'),(6,1,'Daisy','Dog','2021-07-22','Female','Poodle','available'),(7,1,'Mittens','Cat','2023-03-01','Female','Domestic Shorthair','available'),(8,1,'Shadow','Cat','2020-11-11','Male','Bombay','available'),(9,1,'Sparky','Dog','2022-09-05','Male','Dachshund','available'),(10,2,'Lucy','Dog','2021-04-18','Female','Labrador','available'),(11,2,'Leo','Cat','2022-06-30','Male','Siamese','available'),(12,2,'Zoe','Dog','2020-02-29','Female','German Shepherd','available'),(13,2,'Oliver','Cat','2023-01-15','Male','Persian','available'),(14,2,'Max','Dog','2021-10-01','Male','Beagle','available'),(15,3,'Chloe','Dog','2022-05-01','Female','French Bulldog','available'),(16,3,'Jasper','Cat','2021-09-12','Male','Ragdoll','available'),(17,3,'Ruby','Dog','2020-08-08','Female','Corgi','available'),(18,3,'Simba','Cat','2022-02-20','Male','Bengal','available'),(19,3,'Penny','Dog','2023-04-14','Female','Shih Tzu','available'),(20,4,'Duke','Dog','2021-03-03','Male','Rottweiler','available'),(21,4,'Cleo','Cat','2022-07-07','Female','Sphynx','adopted'),(22,4,'Apollo','Dog','2020-10-25','Male','Husky','adopted'),(23,4,'Willow','Cat','2023-05-19','Female','Scottish Fold','adopted'),(24,4,'Gus','Dog','2021-11-30','Male','Bulldog','adopted');
/*!40000 ALTER TABLE `pet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `category` varchar(100) DEFAULT NULL,
  `supplier` varchar(255) DEFAULT NULL,
  `stock_qty` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Dog Food Premium',1200.00,'Food','PetCo',29),(2,'Cat Litter',800.00,'Hygiene','Whiskers',24),(3,'Rabbit Hay',500.00,'Food','FarmFresh',19),(4,'Dog Leash',300.00,'Accessory','PetMart',30),(5,'Interactive Dog Toy Ball',12.99,'Toys','PlayPets Inc',50),(6,'Cat Feather Wand Toy',8.50,'Toys','Feline Fun Co',35),(7,'Chew Bone for Dogs',15.99,'Toys','Durable Toys Ltd',19),(8,'Pet Shampoo & Conditioner Set',22.99,'Grooming','CleanPets Inc',18),(9,'Dog Brush & Comb Set',16.50,'Grooming','Pet Care Pro',29);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `provides_services`
--

DROP TABLE IF EXISTS `provides_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provides_services` (
  `emp_id` int NOT NULL,
  `pet_id` int DEFAULT NULL,
  `service_id` int NOT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`emp_id`,`service_id`),
  KEY `pet_id` (`pet_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `provides_services_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employee` (`emp_id`) ON DELETE CASCADE,
  CONSTRAINT `provides_services_ibfk_2` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`pet_id`) ON DELETE SET NULL,
  CONSTRAINT `provides_services_ibfk_3` FOREIGN KEY (`service_id`) REFERENCES `service` (`service_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provides_services`
--

LOCK TABLES `provides_services` WRITE;
/*!40000 ALTER TABLE `provides_services` DISABLE KEYS */;
INSERT INTO `provides_services` VALUES (1,1,1,'2025-10-14 05:42:18'),(2,2,2,'2025-10-14 05:42:18'),(3,3,3,'2025-10-14 05:42:18'),(4,4,4,'2025-10-14 05:42:18');
/*!40000 ALTER TABLE `provides_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service`
--

DROP TABLE IF EXISTS `service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service` (
  `service_id` int NOT NULL AUTO_INCREMENT,
  `adopter_id` int DEFAULT NULL,
  `service_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `grooming_service` tinyint(1) DEFAULT '0',
  `vet_service` tinyint(1) DEFAULT '0',
  `training_service` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`service_id`),
  KEY `adopter_id` (`adopter_id`),
  CONSTRAINT `service_ibfk_1` FOREIGN KEY (`adopter_id`) REFERENCES `adopter` (`adopter_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service`
--

LOCK TABLES `service` WRITE;
/*!40000 ALTER TABLE `service` DISABLE KEYS */;
INSERT INTO `service` VALUES (1,1,'2025-10-14 04:55:41',1,0,0),(2,2,'2025-10-14 04:55:41',0,1,0),(3,3,'2025-10-14 04:55:41',0,0,1),(4,4,'2025-10-14 04:55:41',1,1,1),(5,5,'2025-11-10 16:26:00',1,1,0);
/*!40000 ALTER TABLE `service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shelter`
--

DROP TABLE IF EXISTS `shelter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shelter` (
  `shelter_id` int NOT NULL AUTO_INCREMENT,
  `shelter_name` varchar(255) NOT NULL,
  `open_hours` varchar(255) DEFAULT NULL,
  `capacity` int NOT NULL DEFAULT '0',
  `current_occupancy` int NOT NULL DEFAULT '0',
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `zipcode` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`shelter_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shelter`
--

LOCK TABLES `shelter` WRITE;
/*!40000 ALTER TABLE `shelter` DISABLE KEYS */;
INSERT INTO `shelter` VALUES (1,'Happy Paws Shelter','9am-6pm',50,0,'Bangalore','Karnataka','India','560001'),(2,'Safe Haven Shelter','10am-5pm',40,0,'Mumbai','Maharashtra','India','400001'),(3,'Furry Friends Home','8am-8pm',60,0,'Delhi','Delhi','India','110001'),(4,'Animal Ark','9am-7pm',45,0,'Vadodara','Gujarat','India','600001');
/*!40000 ALTER TABLE `shelter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `takes_care_of`
--

DROP TABLE IF EXISTS `takes_care_of`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `takes_care_of` (
  `emp_id` int NOT NULL,
  `pet_id` int NOT NULL,
  `assigned_from` date DEFAULT NULL,
  `assigned_to` date DEFAULT NULL,
  PRIMARY KEY (`emp_id`,`pet_id`),
  KEY `pet_id` (`pet_id`),
  CONSTRAINT `takes_care_of_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employee` (`emp_id`) ON DELETE CASCADE,
  CONSTRAINT `takes_care_of_ibfk_2` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`pet_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `takes_care_of`
--

LOCK TABLES `takes_care_of` WRITE;
/*!40000 ALTER TABLE `takes_care_of` DISABLE KEYS */;
INSERT INTO `takes_care_of` VALUES (1,1,'2024-01-01','2024-06-01'),(2,2,'2024-02-01','2024-07-01'),(3,3,'2024-03-01','2024-08-01'),(4,4,'2024-04-01','2024-09-01');
/*!40000 ALTER TABLE `takes_care_of` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `txn_id` int NOT NULL AUTO_INCREMENT,
  `txn_date` date NOT NULL DEFAULT (curdate()),
  `txn_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(50) DEFAULT 'created',
  `mode` varchar(50) DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `provider_ref` varchar(255) DEFAULT NULL,
  `service_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `adopter_id` int DEFAULT NULL,
  PRIMARY KEY (`txn_id`),
  KEY `service_id` (`service_id`),
  KEY `product_id` (`product_id`),
  KEY `adopter_id` (`adopter_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `service` (`service_id`) ON DELETE SET NULL,
  CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE SET NULL,
  CONSTRAINT `transactions_ibfk_3` FOREIGN KEY (`adopter_id`) REFERENCES `adopter` (`adopter_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,'2025-10-14','2025-10-14 04:55:41','completed','cash',1200.00,'TXN001',1,1,1),(2,'2025-10-14','2025-10-14 04:55:41','completed','online',800.00,'TXN002',2,2,2),(3,'2025-10-14','2025-10-14 04:55:41','completed','cash',500.00,'TXN003',3,3,3),(4,'2025-10-14','2025-10-14 04:55:41','completed','online',300.00,'TXN004',4,4,4),(5,'2025-11-11','2025-11-10 19:59:12','completed','cash',16.50,NULL,NULL,9,4),(6,'2025-11-11','2025-11-10 20:48:35','completed','card',16.50,'txn1',NULL,9,2),(7,'2025-11-11','2025-11-11 05:33:29','completed','card',16.50,'txn005',NULL,9,1),(8,'2025-11-12','2025-11-12 08:24:22','completed','card',15.99,'txn010',NULL,7,3);
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_transactions_after_insert` AFTER INSERT ON `transactions` FOR EACH ROW BEGIN
  IF NEW.product_id IS NOT NULL THEN
    UPDATE product
    SET stock_qty = stock_qty - 1
    WHERE product_id = NEW.product_id;
    -- optional: ensure non-negative stock (you might wish to enforce differently)
    UPDATE product
    SET stock_qty = 0
    WHERE product_id = NEW.product_id AND stock_qty < 0;
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-26 16:10:27
