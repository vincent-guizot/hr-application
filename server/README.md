# HR Application API

Backend REST API untuk aplikasi HR, dibangun dengan **Express** + **Sequelize** (PostgreSQL), dilengkapi autentikasi **JWT**, otorisasi berbasis role, dan dokumentasi **Swagger/OpenAPI**.

## Daftar Isi

- [Fitur](#fitur)
- [Tech Stack](#tech-stack)
- [Instalasi & Menjalankan](#instalasi--menjalankan)
- [Struktur Folder](#struktur-folder)
- [Skema Database](#skema-database)
- [Relasi Antar Tabel](#relasi-antar-tabel)
- [Autentikasi & Otorisasi](#autentikasi--otorisasi)
- [Daftar Endpoint](#daftar-endpoint)
- [Dokumentasi Swagger](#dokumentasi-swagger)
- [Query Parameter](#query-parameter-untuk-get-list)
- [Format Error](#format-error)

## Fitur

- CRUD lengkap untuk 7 entity: Region, Country, Location, Department, Job, Employee, Dependent
- Autentikasi JWT (register, login, get current user)
- Otorisasi berbasis role (`employee` / `admin`) dan kepemilikan data (self-or-admin)
- Password di-hash dengan bcrypt dan tidak pernah muncul di response
- Foreign key ditegakkan langsung di level database (bukan hanya di aplikasi)
- Validasi input di level model (required field, format email, dsb.)
- Error handler terpusat yang menerjemahkan error Sequelize jadi response JSON yang konsisten
- Dokumentasi API interaktif via Swagger UI

## Tech Stack

| Package            | Kegunaan                     |
| ------------------ | ---------------------------- |
| express            | Web framework                |
| sequelize + pg     | ORM & driver PostgreSQL      |
| sequelize-cli      | Migration runner             |
| jsonwebtoken       | JWT auth                     |
| bcrypt             | Hash password                |
| cors               | Izinkan akses cross-origin   |
| dotenv             | Baca konfigurasi dari `.env` |
| swagger-ui-express | Sajikan dokumentasi API      |

## Instalasi & Menjalankan

```bash
# 1. install dependency
npm install

# 2. siapkan environment variable
cp .env.example .env
# lalu edit .env: isi DB_USERNAME, DB_PASSWORD, JWT_SECRET, dst.

# 3. buat database & jalankan migration
npx sequelize-cli db:create
npx sequelize-cli db:migrate

# 4. jalankan server
npm run dev      # dengan nodemon (auto-restart)
# atau
node app.js
```

Server berjalan di `http://localhost:3000` (atau sesuai `PORT` di `.env`).

Buka `http://localhost:3000/docs` untuk dokumentasi API interaktif (Swagger UI).

### Variabel environment (`.env`)

| Variabel                                                      | Keterangan                                                              |
| ------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `PORT`                                                        | Port server (default 3000)                                              |
| `NODE_ENV`                                                    | `development` / `test` / `production`                                   |
| `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`, `DB_PORT` | Kredensial PostgreSQL                                                   |
| `DB_NAME_TEST`                                                | Nama database untuk environment `test`                                  |
| `JWT_SECRET`                                                  | Secret untuk menandatangani token JWT — **wajib diganti** di production |
| `JWT_EXPIRES_IN`                                              | Masa berlaku token, contoh `1d`, `12h`                                  |

## Struktur Folder

```
server/
├── app.js                     # entry point: express app, middleware, routing
├── config/
│   └── config.js              # konfigurasi Sequelize, dibaca dari .env
├── docs/
│   └── swagger.js             # spesifikasi OpenAPI (dipakai Swagger UI)
├── middlewares/
│   ├── auth.js                # verifyToken, authorizeRoles
│   ├── selfOrAdmin.js          # izinkan hanya pemilik data atau admin
│   └── errorHandler.js        # notFound (404) + errorHandler terpusat
├── utils/
│   └── asyncHandler.js        # wrapper try/catch untuk controller async
├── models/                    # 7 model Sequelize + index.js (loader)
├── migrations/                # 7 migration, satu per tabel, urut sesuai FK
├── controllers/
│   ├── crudFactory.js         # generator CRUD generik (dipakai 6 controller)
│   ├── AuthController.js      # register, login, me
│   ├── EmployeeController.js  # custom (password, filter role)
│   └── ...Controller.js       # Region/Country/Location/Department/Job/Dependent
├── routes/                    # satu file route per resource + index.js
├── .env.example
├── .sequelizerc                # arahkan sequelize-cli ke config/config.js
└── package.json
```

## Skema Database

### `regions`

| Field                 | Tipe    | Keterangan         |
| --------------------- | ------- | ------------------ |
| id                    | INTEGER | PK, auto increment |
| name                  | STRING  | wajib, unik        |
| createdAt / updatedAt | DATE    | timestamp otomatis |

### `countries`

| Field                 | Tipe    | Keterangan               |
| --------------------- | ------- | ------------------------ |
| id                    | INTEGER | PK                       |
| name                  | STRING  | wajib                    |
| regionId              | INTEGER | FK → `regions.id`, wajib |
| createdAt / updatedAt | DATE    |                          |

### `locations`

| Field                 | Tipe    | Keterangan                 |
| --------------------- | ------- | -------------------------- |
| id                    | INTEGER | PK                         |
| street_address        | STRING  | opsional                   |
| postal_code           | INTEGER | opsional                   |
| city                  | STRING  | wajib                      |
| state_province        | STRING  | opsional                   |
| countryId             | INTEGER | FK → `countries.id`, wajib |
| createdAt / updatedAt | DATE    |                            |

### `departments`

| Field                 | Tipe    | Keterangan                 |
| --------------------- | ------- | -------------------------- |
| id                    | INTEGER | PK                         |
| name                  | STRING  | wajib                      |
| locationId            | INTEGER | FK → `locations.id`, wajib |
| createdAt / updatedAt | DATE    |                            |

### `jobs`

| Field                 | Tipe    | Keterangan                  |
| --------------------- | ------- | --------------------------- |
| id                    | INTEGER | PK                          |
| title                 | STRING  | wajib                       |
| min_salary            | INTEGER | opsional, ≥ 0               |
| max_salary            | INTEGER | opsional, ≥ 0, ≥ min_salary |
| createdAt / updatedAt | DATE    |                             |

### `employees`

| Field                 | Tipe    | Keterangan                                                       |
| --------------------- | ------- | ---------------------------------------------------------------- |
| id                    | INTEGER | PK                                                               |
| first_name            | STRING  | wajib                                                            |
| last_name             | STRING  | wajib                                                            |
| email                 | STRING  | wajib, unik, format email                                        |
| phone_number          | STRING  | opsional                                                         |
| hire_date             | DATE    | opsional                                                         |
| jobId                 | INTEGER | FK → `jobs.id`, opsional                                         |
| salary                | INTEGER | opsional, ≥ 0                                                    |
| role                  | STRING  | `employee` (default) atau `admin`                                |
| password              | STRING  | wajib, **di-hash bcrypt**, tidak pernah dikembalikan di response |
| image                 | STRING  | opsional                                                         |
| departmentId          | INTEGER | FK → `departments.id`, opsional                                  |
| createdAt / updatedAt | DATE    |                                                                  |

### `dependents`

| Field                 | Tipe    | Keterangan                          |
| --------------------- | ------- | ----------------------------------- |
| id                    | INTEGER | PK                                  |
| first_name            | STRING  | wajib                               |
| last_name             | STRING  | wajib                               |
| relationship          | STRING  | opsional, contoh: `child`, `spouse` |
| employeeId            | INTEGER | FK → `employees.id`, wajib          |
| createdAt / updatedAt | DATE    |                                     |

## Relasi Antar Tabel

```
region  (1)──< country  (1)──< location  (1)──< department  (1)──< employee  (1)──< dependent
                                                       job    (1)──< employee
```

| Relasi                | Tipe                | Perilaku saat parent dihapus                     |
| --------------------- | ------------------- | ------------------------------------------------ |
| region → country      | hasMany / belongsTo | **CASCADE** (ikut terhapus)                      |
| country → location    | hasMany / belongsTo | **CASCADE**                                      |
| location → department | hasMany / belongsTo | **CASCADE**                                      |
| department → employee | hasMany / belongsTo | **SET NULL** (`departmentId` employee jadi null) |
| job → employee        | hasMany / belongsTo | **SET NULL** (`jobId` employee jadi null)        |
| employee → dependent  | hasMany / belongsTo | **CASCADE**                                      |

Semua relasi ini ditegakkan **langsung di level PostgreSQL** (foreign key constraint pada migration), bukan cuma asumsi di kode aplikasi.

## Autentikasi & Otorisasi

- Autentikasi memakai **JWT**. Kirim di header setiap request yang butuh login:
  ```
  Authorization: Bearer <token>
  ```
- Dua role: `employee` (default saat registrasi) dan `admin`.
- Registrasi publik (`POST /auth/register`) **selalu** membuat akun dengan role `employee` — tidak bisa langsung daftar sebagai admin.
- Untuk menjadikan seseorang admin, seorang admin lain harus meng-update field `role` via `PUT /employees/:id`.
- Aturan akses per resource:

| Resource                                   | Baca        | Buat / Ubah / Hapus                                                                                                              |
| ------------------------------------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| region, country, location, department, job | publik      | **admin**                                                                                                                        |
| employee                                   | wajib login | buat & hapus: **admin**; ubah: **pemilik akun sendiri atau admin** (non-admin tidak bisa mengubah field `role` miliknya sendiri) |
| dependent                                  | wajib login | buat & ubah: wajib login; hapus: **admin**                                                                                       |

## Daftar Endpoint

### Auth

| Method | Path             | Akses  |
| ------ | ---------------- | ------ |
| POST   | `/auth/register` | publik |
| POST   | `/auth/login`    | publik |
| GET    | `/auth/me`       | login  |

### Region / Country / Location / Department / Job

Pola yang sama untuk `/regions`, `/countries`, `/locations`, `/departments`, `/jobs`:

| Method | Path              | Akses  |
| ------ | ----------------- | ------ |
| GET    | `/{resource}`     | publik |
| GET    | `/{resource}/:id` | publik |
| POST   | `/{resource}`     | admin  |
| PUT    | `/{resource}/:id` | admin  |
| DELETE | `/{resource}/:id` | admin  |

### Employee

| Method | Path             | Akses                      |
| ------ | ---------------- | -------------------------- |
| GET    | `/employees`     | login                      |
| GET    | `/employees/:id` | login                      |
| POST   | `/employees`     | admin                      |
| PUT    | `/employees/:id` | pemilik sendiri atau admin |
| DELETE | `/employees/:id` | admin                      |

### Dependent

| Method | Path              | Akses |
| ------ | ----------------- | ----- |
| GET    | `/dependents`     | login |
| GET    | `/dependents/:id` | login |
| POST   | `/dependents`     | login |
| PUT    | `/dependents/:id` | login |
| DELETE | `/dependents/:id` | admin |

## Dokumentasi Swagger

Spesifikasi OpenAPI 3.0 tersedia di dua tempat:

- **Swagger UI (interaktif)**: `GET /docs` — bisa langsung coba tiap endpoint dari browser, termasuk isi token JWT lewat tombol "Authorize".
- **Raw JSON spec**: `GET /docs.json` — bisa diimpor ke Postman/Insomnia.

File sumber: `docs/swagger.js`.

## Query Parameter untuk GET (list)

Semua endpoint `GET /{resource}` mendukung:

- `?search=kata` — partial match (case-insensitive) pada field utama resource (`name` untuk region/country/department, `city` untuk location, `title` untuk job, `first_name` untuk dependent, atau kombinasi nama+email untuk employee).
- `?kolomFk=nilai` — filter exact-match pada kolom lain yang benar-benar ada di tabel, misalnya `?regionId=1`, `?departmentId=2`.

Contoh:

```
GET /countries?regionId=1
GET /employees?search=budi
GET /employees?departmentId=2
```

## Format Error

Semua error dikembalikan dalam bentuk konsisten:

```json
{
  "message": "Validation error",
  "errors": ["email is already registered"]
}
```

| Status | Kapan terjadi                                                                   |
| ------ | ------------------------------------------------------------------------------- |
| 400    | Validasi gagal, field wajib kosong, duplikat unik, atau foreign key tidak valid |
| 401    | Token tidak ada / tidak valid / kedaluwarsa                                     |
| 403    | Sudah login tapi tidak punya izin (role atau bukan pemilik data)                |
| 404    | Data atau route tidak ditemukan                                                 |
| 500    | Error tak terduga di server                                                     |
