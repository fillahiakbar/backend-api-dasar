const { nanoid } = require("nanoid");
const books = require("./books");

const addBooksHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  // Validasi properti name
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  

  // Validasi readPage tidak lebih besar dari pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // Membuat id unik untuk buku baru
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage; // Menentukan status finished

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  // Menambahkan buku ke array books
  books.push(newBook);

  // Respons sukses bila buku berhasil ditambahkan
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
  response.code(201);
  response.header('Access-Control-Allow-Origin', '*');
  return response;
};

// Handler untuk menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
  // Jika belum ada buku, respons dengan array kosong
  if (books.length === 0) {
    return h.response({
      status: 'success',
      data: {
        books: [],
      },
    }).code(200);
  }

  // Menampilkan seluruh buku dengan format yang diminta
  const booksData = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return h.response({
    status: 'success',
    data: {
      books: booksData,
    },
  }).code(200);
};

// Handler untuk menampilkan detail buku berdasarkan id
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params; // Mendapatkan bookId dari parameter URL

  // Mencari buku dengan id yang sesuai
  const book = books.find((b) => b.id === bookId);

  // Jika buku tidak ditemukan
  if (!book) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  // Jika buku ditemukan, kembalikan data buku tersebut
  const response = h.response({
    status: 'success',
    data: {
        book: {
        id: book.id,
        name: book.name,
        year: book.year,
        author: book.author,
        summary: book.summary,
        publisher: book.publisher,
        pageCount: book.pageCount,
        readPage: book.readPage,
        finished: book.finished,
        reading: book.reading,
        insertedAt: book.insertedAt,
        updatedAt: book.updatedAt,
      },
    },
  });
  response.code(200);
  return response;
};

const updateBookByIdHandler = (request, h) => {
    const { bookId } = request.params; // Mendapatkan bookId dari parameter URL
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  
    // Validasi properti name
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }
  
    // Validasi readPage tidak lebih besar dari pageCount
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }
  
    // Mencari buku berdasarkan bookId
    const index = books.findIndex((book) => book.id === bookId);
    
    // Jika buku tidak ditemukan
    if (index === -1) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      });
      response.code(404);
      return response;
    }
  
    // Mengupdate data buku
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt: new Date().toISOString(),
      finished: pageCount === readPage,
    };
  
    // Respons sukses jika buku berhasil diperbarui
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  };

  
  const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params; // Mendapatkan bookId dari parameter URL
  
    // Mencari index buku berdasarkan bookId
    const index = books.findIndex((book) => book.id === bookId);
  
    // Jika buku tidak ditemukan
    if (index === -1) {
      const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      });
      response.code(404);
      return response;
    }
  
    // Menghapus buku dari array books
    books.splice(index, 1);
  
    // Respons sukses jika buku berhasil dihapus
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  };
  

module.exports = { addBooksHandler, getAllBooksHandler, getBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler };
