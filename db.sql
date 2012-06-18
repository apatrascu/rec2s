-- --------------------------------------------------------
-- Host:                         192.168.1.56
-- Server version:               5.5.16 - MySQL Community Server (GPL)
-- Server OS:                    Win32
-- HeidiSQL version:             7.0.0.4151
-- Date/time:                    2012-06-18 21:22:54
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET FOREIGN_KEY_CHECKS=0 */;

-- Dumping database structure for rec2s
DROP DATABASE IF EXISTS `rec2s`;
CREATE DATABASE IF NOT EXISTS `rec2s` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `rec2s`;


-- Dumping structure for table rec2s.leases
DROP TABLE IF EXISTS `leases`;
CREATE TABLE IF NOT EXISTS `leases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(10) DEFAULT NULL,
  `lease` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1089 DEFAULT CHARSET=latin1;

-- Dumping data for table rec2s.leases: ~0 rows (approximately)
DELETE FROM `leases`;
/*!40000 ALTER TABLE `leases` DISABLE KEYS */;
/*!40000 ALTER TABLE `leases` ENABLE KEYS */;


-- Dumping structure for table rec2s.scheduler_delayable
DROP TABLE IF EXISTS `scheduler_delayable`;
CREATE TABLE IF NOT EXISTS `scheduler_delayable` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `lease` varchar(5000) DEFAULT NULL,
  `timeout` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=latin1;

-- Dumping data for table rec2s.scheduler_delayable: ~0 rows (approximately)
DELETE FROM `scheduler_delayable`;
/*!40000 ALTER TABLE `scheduler_delayable` DISABLE KEYS */;
/*!40000 ALTER TABLE `scheduler_delayable` ENABLE KEYS */;


-- Dumping structure for table rec2s.scheduler_running
DROP TABLE IF EXISTS `scheduler_running`;
CREATE TABLE IF NOT EXISTS `scheduler_running` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `lease` varchar(5000) DEFAULT NULL,
  `vm` int(10) DEFAULT NULL,
  `started` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=latin1;

-- Dumping data for table rec2s.scheduler_running: ~1 rows (approximately)
DELETE FROM `scheduler_running`;
/*!40000 ALTER TABLE `scheduler_running` DISABLE KEYS */;
INSERT INTO `scheduler_running` (`id`, `lease`, `vm`, `started`) VALUES
	(69, '{"credentials":{"details":{"id":1,"certificate":"a","username":"test","password":"test"},"request":{"username":"test","password":"test"},"access":"granted"},"lease":{"processorVendor":"Intel","networkBandwidth":"100","memorySize":"128","leaseStartTime":"","leaseEndTime":"","leaseType":"URGENT","leasePreemptible":"false","minimumInstancesCount":"1","processorSpeed":"500","storageCapacity":"1","maximumInstancesCount":"2","processorArchitecture":"x86","numberOfCores":"1","templateName":"U_S_10_04_S"},"added":1329443016998}', 11, '1329443018170');
/*!40000 ALTER TABLE `scheduler_running` ENABLE KEYS */;


-- Dumping structure for table rec2s.user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT '0',
  `password` varchar(100) DEFAULT '0',
  `certificate` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table rec2s.user: ~1 rows (approximately)
DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `username`, `password`, `certificate`) VALUES
	(1, 'test', 'test', 'a');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
/*!40014 SET FOREIGN_KEY_CHECKS=1 */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
