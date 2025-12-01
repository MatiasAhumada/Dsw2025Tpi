-- Script para insertar productos de prueba para testing de paginación
USE DswDb;

INSERT INTO Products (GuidCode, Sku, InternalCode, Name, Description, CurrentUnitPrice, StockQuantity, IsActive, CreatedAt, UpdatedAt)
VALUES 
(NEWID(), 'TEST001', 'INT001', 'Producto Test 1', 'Descripción del producto test 1', 10.99, 50, 1, GETDATE(), GETDATE()),
(NEWID(), 'TEST002', 'INT002', 'Producto Test 2', 'Descripción del producto test 2', 15.99, 30, 1, GETDATE(), GETDATE()),
(NEWID(), 'TEST003', 'INT003', 'Producto Test 3', 'Descripción del producto test 3', 20.99, 25, 1, GETDATE(), GETDATE()),
(NEWID(), 'TEST004', 'INT004', 'Producto Test 4', 'Descripción del producto test 4', 12.99, 40, 1, GETDATE(), GETDATE()),
(NEWID(), 'TEST005', 'INT005', 'Producto Test 5', 'Descripción del producto test 5', 18.99, 35, 1, GETDATE(), GETDATE()),
(NEWID(), 'TEST006', 'INT006', 'Producto Test 6', 'Descripción del producto test 6', 22.99, 20, 1, GETDATE(), GETDATE()),
(NEWID(), 'TEST007', 'INT007', 'Producto Test 7', 'Descripción del producto test 7', 14.99, 45, 1, GETDATE(), GETDATE()),
(NEWID(), 'TEST008', 'INT008', 'Producto Test 8', 'Descripción del producto test 8', 16.99, 38, 1, GETDATE(), GETDATE()),
(NEWID(), 'TEST009', 'INT009', 'Producto Test 9', 'Descripción del producto test 9', 24.99, 28, 1, GETDATE(), GETDATE()),
(NEWID(), 'TEST010', 'INT010', 'Producto Test 10', 'Descripción del producto test 10', 13.99, 42, 1, GETDATE(), GETDATE()),
(NEWID(), 'TEST011', 'INT011', 'Producto Test 11', 'Descripción del producto test 11', 19.99, 33, 1, GETDATE(), GETDATE()),
(NEWID(), 'TEST012', 'INT012', 'Producto Test 12', 'Descripción del producto test 12', 21.99, 27, 1, GETDATE(), GETDATE()),
(NEWID(), 'TEST013', 'INT013', 'Producto Test 13', 'Descripción del producto test 13', 17.99, 36, 1, GETDATE(), GETDATE()),
(NEWID(), 'TEST014', 'INT014', 'Producto Test 14', 'Descripción del producto test 14', 23.99, 31, 1, GETDATE(), GETDATE()),
(NEWID(), 'TEST015', 'INT015', 'Producto Test 15', 'Descripción del producto test 15', 11.99, 48, 1, GETDATE(), GETDATE());

PRINT '15 productos de prueba insertados exitosamente';