const API_URL = 'http://localhost:3001';

const categories = [
  'Tecnología',
  'Ciencias',
  'Historia',
  'Literatura',
  'Derecho'
];

const books = [
  { title: 'Clean Code', author: 'Robert C. Martin', isbn: 'TEST-001', quantity: 5 },
  { title: 'Design Patterns', author: 'Gang of Four', isbn: 'TEST-002', quantity: 3 },
  { title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', isbn: 'TEST-003', quantity: 4 },
  { title: 'Refactoring', author: 'Martin Fowler', isbn: 'TEST-004', quantity: 2 },
  { title: 'Code Complete', author: 'Steve McConnell', isbn: 'TEST-005', quantity: 6 },
  { title: 'The C Programming Language', author: 'Kernighan & Ritchie', isbn: 'TEST-006', quantity: 3 },
  { title: 'Introduction to Algorithms', author: 'CLRS', isbn: 'TEST-007', quantity: 4 },
  { title: 'The Art of Computer Programming', author: 'Donald Knuth', isbn: 'TEST-008', quantity: 2 },
  { title: 'Structure and Interpretation of Computer Programs', author: 'Abelson & Sussman', isbn: 'TEST-009', quantity: 3 },
  { title: 'Algorithms', author: 'Sedgewick & Wayne', isbn: 'TEST-010', quantity: 5 },
  { title: 'Database System Concepts', author: 'Silberschatz et al.', isbn: 'TEST-011', quantity: 2 },
  { title: 'Modern Operating Systems', author: 'Andrew Tanenbaum', isbn: 'TEST-012', quantity: 3 },
];

async function createTestBooks() {
  try {
    console.log('🔐 Autenticando...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@library.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(loginData.message || 'Login failed');
    
    const token = loginData.token;
    console.log('✓ Autenticado\n');

    // Obtener categorías
    console.log('📚 Obteniendo categorías...');
    const catsRes = await fetch(`${API_URL}/categories`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const cats = await catsRes.json();
    const catsMap = cats.reduce((m, c) => ({ ...m, [c.name]: c.id }), {});
    console.log('✓ Categorías cargadas\n');

    // Crear libros
    console.log('📖 Creando libros de prueba:\n');
    let created = 0;
    for (const book of books) {
      try {
        const res = await fetch(`${API_URL}/books`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ...book,
            categoryId: catsMap['Tecnología'],
            description: `Libro de prueba: ${book.title}`
          })
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error creating book');
        
        created++;
        console.log(`  ✓ ${book.title}`);
      } catch (err) {
        console.log(`  ✗ ${book.title}: ${err.message}`);
      }
    }
    
    console.log(`\n✅ ${created}/${books.length} libros creados`);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

createTestBooks();
