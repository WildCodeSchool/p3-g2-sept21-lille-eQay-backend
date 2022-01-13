CREATE TABLE `adresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `region` varchar(45) DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `longitude` float(17,8) NOT NULL,
  `latitude` float(17,8) NOT NULL,
  PRIMARY KEY (`longitude`,`latitude`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56013 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci