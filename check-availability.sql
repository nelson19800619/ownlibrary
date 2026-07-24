SELECT id, title, quantity, available, 
       (SELECT COUNT(*) FROM "Loan" WHERE "Loan"."bookId" = "Book".id AND status = 'ACTIVE') as active_loans
FROM "Book" 
ORDER BY "Book"."createdAt" DESC 
LIMIT 15;
