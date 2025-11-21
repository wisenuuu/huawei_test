/*
 
 CREATE TABLE Karyawan (
 Name VARCHAR(50) NOT NULL,
 Position VARCHAR(50) NOT NULL,
 Join_Date DATE NOT NULL,
 Release_Date DATE NULL,
 Year_of_Experience VARCHAR(50) NOT NULL,
 Salary VARCHAR(50) NOT NULL -- Diubah ke VARCHAR untuk menampung '$150', '$155', dst.
 );
 
 INSERT INTO Karyawan (Name, Position, Join_Date, Release_Date, Year_of_Experience, Salary) VALUES
 ('Jacky', 'Solution Architect', '2018-07-25', '2022-07-25', '8 Years', '$150'),
 ('John', 'Assistan Manager', '2016-02-02', '2021-02-02', '12 Years', '$155'),
 ('Alano', 'Manager', '2010-11-09', NULL, '14 Years', '$175'), 
 ('Aaron', 'Engineer', '2021-08-16', '2022-08-16', '1 Years', '$80'),
 ('Allen', 'Engineer', '2024-06-06', NULL, '4 Years', '$75'), 
 ('Peter', 'Team Leader', '2020-01-09', NULL, '3 Years', '$85');
 
 */
/*
 1. Menambahkan satu personel ke dalam tabel
 */
insert into Karyawan(
        name,
        position,
        year_of_experience,
        salary,
        join_date
    )
values (
        'Albert',
        'Engineer',
        '2.5 Years',
        '$50',
        '2024-01-24'
    );
   
/*
 2. Update table engineer
 */
update Karyawan
set salary = '$85'
where position = 'Engineer';

/*
 3. Hitunng total salary 2021
 */
with active_months as (
    select cast(replace(salary, '$', '') as int) as salary,
        greatest(join_date, '2021-01-01') as active_date,
        least(release_date, '2021-12-31') as end_active
    from karyawan
    where join_date <= '2021-12-31'
        and (
            release_date is null
            or release_date >= '2021-01-01'
        )
),
months as (
    select salary,
        sum(
            extract(
                month
                from age(end_active, active_date)
            ) + 1
        ) as total_month
    from active_months
    group by salary
)
select sum(salary * total_month) as total_salary_2021
from months

    /*
     4, Sorting Menampilkan Years of experience 
     */
select year_of_experience
from karyawan
order by cast(
        replace(year_of_experience, 'Years', '') as decimal
    ) desc
limit 3;

/*
 5. subquery untuk mencari employee dengan posisi engineer dan pengalaman yang kurang dari sama dengan 3 tahun
 */
select 
  name, 
  year_of_experience 
from 
  Karyawan 
where 
  position in (
    select 
      position 
    from 
      Karyawan 
    where 
      lower(position) = 'engineer'
  ) 
  and year_of_experience in (
    select 
      year_of_experience 
    from 
      karyawan 
    where 
      cast(
        replace(year_of_experience, 'Years', '') as decimal
      ) <= 3.0
  );