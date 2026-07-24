-- Obtener ID de categoría Tecnología
WITH tech_cat AS (
  SELECT id FROM "Category" WHERE name = 'Tecnología' LIMIT 1
)
INSERT INTO "Book" (id, title, author, isbn, description, quantity, "categoryId", "createdAt", "updatedAt")
VALUES 
  ('test-001', 'Clean Code', 'Robert C. Martin', 'TEST-001', 'Libro de prueba: Clean Code', 5, (SELECT id FROM tech_cat), NOW(), NOW()),
  ('test-002', 'Design Patterns', 'Gang of Four', 'TEST-002', 'Libro de prueba: Design Patterns', 3, (SELECT id FROM tech_cat), NOW(), NOW()),
  ('test-003', 'The Pragmatic Programmer', 'Hunt & Thomas', 'TEST-003', 'Libro de prueba: The Pragmatic Programmer', 4, (SELECT id FROM tech_cat), NOW(), NOW()),
  ('test-004', 'Refactoring', 'Martin Fowler', 'TEST-004', 'Libro de prueba: Refactoring', 2, (SELECT id FROM tech_cat), NOW(), NOW()),
  ('test-005', 'Code Complete', 'Steve McConnell', 'TEST-005', 'Libro de prueba: Code Complete', 6, (SELECT id FROM tech_cat), NOW(), NOW()),
  ('test-006', 'The C Programming Language', 'Kernighan & Ritchie', 'TEST-006', 'Libro de prueba: The C Programming Language', 3, (SELECT id FROM tech_cat), NOW(), NOW()),
  ('test-007', 'Introduction to Algorithms', 'CLRS', 'TEST-007', 'Libro de prueba: Introduction to Algorithms', 4, (SELECT id FROM tech_cat), NOW(), NOW()),
  ('test-008', 'The Art of Computer Programming', 'Donald Knuth', 'TEST-008', 'Libro de prueba: The Art of Computer Programming', 2, (SELECT id FROM tech_cat), NOW(), NOW()),
  ('test-009', 'Structure and Interpretation of Computer Programs', 'Abelson & Sussman', 'TEST-009', 'Libro de prueba: SICP', 3, (SELECT id FROM tech_cat), NOW(), NOW()),
  ('test-010', 'Algorithms', 'Sedgewick & Wayne', 'TEST-010', 'Libro de prueba: Algorithms', 5, (SELECT id FROM tech_cat), NOW(), NOW()),
  ('test-011', 'Database System Concepts', 'Silberschatz et al.', 'TEST-011', 'Libro de prueba: Database System Concepts', 2, (SELECT id FROM tech_cat), NOW(), NOW()),
  ('test-012', 'Modern Operating Systems', 'Andrew Tanenbaum', 'TEST-012', 'Libro de prueba: Modern Operating Systems', 3, (SELECT id FROM tech_cat), NOW(), NOW());
