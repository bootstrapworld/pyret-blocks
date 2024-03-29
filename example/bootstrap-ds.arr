# provide *

string-length("a", "b")
string-length(3)

table: name :: List<String>, age :: Number, favorite-color :: String
  row: [list: "B"], 12, "blue"
  row: [list: "A"], 17, "green"
  row: [list: "E"], 13, "red"
end

data Posn:
  | posn(x :: Number, y :: Number) 
  | nice(s :: String)
end

reactor:
  seconds-per-tick: 0.1,
  title: "Count by 10",
  on-tick: tencrement,
  init: 10,
end


data Posn:
  | posn(x :: Number, y :: Number) 
end

data World:
  | world(
      dangers :: List<Being>,
      shots :: List<Being>,
      targets :: List<Being>,
      player :: Being,
      bg,
      score :: Number,
      title :: String,
      timer :: Number)
end


reactor:
  seconds-per-tick: 0.1,
  title: "Count by 10",
  on-tick: tencrement,
  init: 10,
end



can-drive = sieve my-table using age:
  age >= 16
end

sieve my-table using age, name:
  age >= 16
end


extend ball-info using pos-y: vel-y: T.difference-from(25) of pos-y end



with-min-max = extend some-numbers using n:
  max :: Number: T.running-max of n,
  min :: Number: T.running-min of n
end


select name, artists, year, danceability, energy, key, loudness, mode, 
speechiness, acousticness, instrumentalness, liveness, valence, tempo, duration-ms, time-signature from my-table end
select name, artists, year from my-table end


var y = extract name from my-table end


select name, artists, year, danceability, energy, key,    loudness, mode, 
speechiness, acousticness, instrumentalness, liveness, valence, tempo, duration-ms, time-signature from my-table end

extract name from my-table end

order some-table:
  column1 ascending,
  column2 descending
end


can-drive-col = extend my-table using age:
  can-drive: age >= 16,
  can-eat :: Boolean: age <= 1
end

toptracks-table = load-table: name, artists, year, danceability, energy, key,    loudness, mode, 
  speechiness, acousticness, instrumentalness, liveness, valence, tempo, duration-ms, time-signature
  source: toptracks-sheet.sheet-by-name("2019", true)
end

load-table: name :: String, age :: Number, favorite-color :: String
  source: imported-my-table.sheet-by-name("3-rows", true)
  sanitize name using DS.string-sanitizer
  sanitize age using DS.strict-num-sanitizer
  sanitize favorite-color using DS.string-sanitizer
end

block: 
3
4
end


lam(str :: String) -> String:
  doc: "ABC"
  y = str + "A"
  y
end



can-var = extend batting
  using at-bats, singles, doubles, triples, home-runs:
  batting-average: (singles + doubles + triples + home-runs) / at-bats,
  slugging-percentage: (singles + (doubles * 2) +
    (triples * 3) + (home-runs * 4)) / at-bats
end

load-table: name :: String, age :: Number, favorite-color :: String
  source: imported-my-table.sheet-by-name("3-rows", true)
  sanitize name using DS.string-sanitizer
  sanitize age using DS.strict-num-sanitizer
  sanitize favorite-color using DS.string-sanitizer
end

toptracks-table = load-table: name, artists, year, danceability, energy, key,    loudness, mode, 
  speechiness, acousticness, instrumentalness, liveness, valence, tempo, duration-ms, time-signature
  source: toptracks-sheet.sheet-by-name("2019", true)
end

fun add(n :: Number):
  doc: ""
  y = n + 1
  n
end

can-drive-col = extend my-table using age:
  can-drive: age >= 16,
  can-eat :: Boolean: age <= 1
end

z = x + 1

fun add(n): n end

#|
a = string-length("b")
a = string-length(5)
a = string-length("b", "c")
a = sqr(3)
a = sqr()
a = customfunc()
a = customfunc("A", "b")
|#

batting-avg-and-slugging = extend batting
  using at-bats, singles, doubles, triples, home-runs:
  batting-average: (singles + doubles + triples + home-runs) / at-bats,
  slugging-percentage: (singles + (doubles * 2) +
    (triples * 3) + (home-runs * 4)) / at-bats
end


can-drive-col = extend my-table using age:
  can-drive: age >= 16,
  can-eat :: Boolean: age <= 1
end

my-table = table: name, age
    row: "Bob", 12
    row: "Alice", 17
    row: "Eve", 13
  end


can-drive-col = extend my-table using age:
  can-drive: age >= 16,
  can-eat: age <= 1
end

table: name :: {String; Number}, age :: Number, favorite-color :: String
  row: "B", 12, "blue"
  row: "A", 17, "green"
  row: "E", 13, "red"
end


table: name :: List<String>, age :: Number, favorite-color :: String
  row: [list: "B"], 12, "blue"
  row: [list: "A"], 17, "green"
  row: [list: "E"], 13, "red"
end

"B"




can-drive-col = extend my-table using age:
  can-drive: age >= 16
end



a :: (Number, Number -> Number)
bda :: Number, Number -> String
j :: Number
a :: {Number; Number}




fun a(n):
 doc: "ABC"
 x = n / 2
 n
end

y = n + 1



load-table: name :: String, age :: Number, favorite-color :: String
  source: imported-my-table.sheet-by-name("3-rows", true)
  sanitize name using DS.string-sanitizer
  sanitize age using DS.strict-num-sanitizer
  sanitize favorite-color using DS.string-sanitizer
end



fun f(x :: Number) -> Number:
  doc: "test doc string!" 
  fun t(xl :: Number) -> Number:
    xl - 1
  end
  x - 1
end

lam(str :: String) -> String:
  doc: "ABC"
  y = str + "A"
  y
end

a = lam(n): 1 end

fun a(n):
 doc: "ABC"
 n
end

a = lam(n): 1 end

lam(str :: String) -> String:
  y = str + "A"
  y
end

fun add(n :: (Number -> Number)):
  n
end

a = string-length("Abc")

# [list: 1, [list: 1, 2, 3], 3]

"A" + "B"


for map(elem from range(0, 3)):
  elem + 2
end









table: name :: String, age :: Number, favorite-color :: String
  row: "Bobdgssssssss", 12, "blue"
  row: "Alicgsdddddddde", 17, "green"
  row: "Evgsdsdsdsdsdsde", 13, "red"
  row: "Bobdgssssssss", 12, "blue"
  row: "Alicgsdddddddde", 17, "green"
  row: "Evgsdsdsdsdsdsde", 13, "red"
  row: "Bobdgssssssss", 12, "blue"
  row: "Alicgsdddddddde", 17, "green"
  row: "Evgsdsdsdsdsdsde", 13, "red"
  row: "Bobdgssssssss", 12, "blue"
  row: "Alicgsdddddddde", 17, "green"
end



lam(x):
  lam(y):
    z = y - x
    a = z * 2
    a - z
  end
end

fun add(n :: Number) -> Number:
  fun sub(num :: Number) -> Number:
    num - 1
  end
  n + 1
end









load-table: name :: String, age :: Number, favorite-color :: String
  source: imported-my-table.sheet-by-name("3-rows", true)
end



[...: 1, 2]

[raw-row: {"city"; "NYC"}, {"pop"; 8500000}]





[list-set: ]





table: name :: String, age :: Number, favorite-color :: String
  row: "Bobdgssssssss", 12, "blue"
  row: "Alicgsdddddddde", 17, "green"
  row: "Evgsdsdsdsdsdsde", 13, "red"
  row: "Bobdgssssssss", 12, "blue"
  row: "Alicgsdddddddde", 17, "green"
  row: "Evgsdsdsdsdsdsde", 13, "red"
  row: "Bobdgssssssss", 12, "blue"
  row: "Alicgsdddddddde", 17, "green"
  row: "Evgsdsdsdsdsdsde", 13, "red"
  row: "Bobdgssssssss", 12, "blue"
  row: "Alicgsdddddddde", 17, "green"
end




x + 3
y = x + 1

fun test(): 
x + 3
end

table: name :: List<String>, age :: Number, favorite-color :: String
  row: "Alicgsdddddddde", 17, "green"
end

table: name :: String, age :: Number, favorite-color :: String
  row: "Bobdgssssssss", 12, "blue"
  row: "Alicgsdddddddde", 17, "green"
  row: "Evgsdsdsdsdsdsde", 13, "red"
  row: "Bobdgssssssss", 12, "blue"
  row: "Alicgsdddddddde", 17, "green"
  row: "Evgsdsdsdsdsdsde", 13, "red"
  row: "Bobdgssssssss", 12, "blue"
  row: "Alicgsdddddddde", 17, "green"
  row: "Evgsdsdsdsdsdsde", 13, "red"
  row: "Bobdgssssssss", 12, "blue"
  row: "Alicgsdddddddde", 17, "green"
end


a-two-d-list = [list: [list: "A", "B", "C"], 2]
a-two-d-list = [list: [list: 3], [list: "B"]]
a-two-d-list = [list: [list: "a"], [list: "B"]]
a-two-d-list = [list: 1, [list: "A", "B", "C"], 2]


vert = a(b(c(d(e(1)))))

a-num = 3
a-string = "three"
a-boolean = true
a-num-constructor = [list: 1, 2, 3]
a-string-constructor = [list: "a", "b"]
not-consistent-typing = [list: 1, "a", 3]
another-variable = foo
var a-mutable = 3
var a-mutable-construktor = [list: "a"]

a-two-d-list = [list: [list: "a"]]
another-two-d-list = [list: 3, [list: "a"]]
fun add(n :: Number) -> Number:
  doc: "Phil when Wilbur says that he gets sand from fish tanks: YOU NEED TO STOP Phil when Wilbur says that he gets it from crematoriums: bruhhh Performance of an unreleased song called"
  x = n + 1 + 5 + 6 + 7 + 7 + 7 + 1 + 7 + 7 + 7 + 1
  x
end


a-binop = 1 + 3
another-binop = 1 * 3
greater-than = 3 < 5
b = 3.foo(4)
c = sqrt(4)
num = string-length("abc")
aString = string-append("hello", "world")

vert = sqrt(sqrt(sqrt(4)))
table: name :: String, age :: Number, favorite-color :: String
  row: "B", 12, "blue"
  row: "A", 17, "green"
  row: "E", 13, "red"
end


table: name :: String, age :: Number, favorite-color :: String
  row: "Bobdgssssssss", 12, "blue"
  row: "Alicgsdddddddde", 17, "green"
  row: "Evgsdsdsdsdsdsde", 13, "red"
  row: "Bobdgssssssss", 12, "blue"
  row: "Alicgsdddddddde", 17, "green"
  row: "Evgsdsdsdsdsdsde", 13, "red"
  row: "Bobdgssssssss", 12, "blue"
  row: "Alicgsdddddddde", 17, "green"
  row: "Evgsdsdsdsdsdsde", 13, "red"
  row: "Bobdgssssssss", 12, "blue"
  row: "Alicgsdddddddde", 17, "green"
end

[list-set: ]


table: name :: String, age :: Number, favorite-color :: String
  row: "B", 12, "blue"
  row: "A", 17, "green"
  row: "E", 13, "red"
end


load-table: name, age, favorite-color
  source: imported-my-table
end

fun add():
  doc: "dee"
  n + 1
end

fun add(n :: Number, s :: String) -> Number:
  doc: "ABCDEFG"
  n
end


fun test(n :: Number) -> Number: doc: "Phil when Wilbur says that he gets sand from fish tanks: YOU NEED TO STOP Phil when Wilbur says that he gets it from crematoriums: bruhh" n end

x = for map(elem from range(0, 3)):
  elem + 2
end

lam(x): x + 1 end

lam(x):
  lam(y):
    z = y + x
    a = z / 2
    a + z
  end
end

if (x):
  y = x + 1
  3
else:
  z = x + 1
  5
end

var all-for-one = "ONE FOR ALL FULL COWLING"
all-for-one := 1

vert = a(b(c(d(e(1)))))

fun cull(beings :: List<Being>) -> List<Being>:
  for filter(b from beings):
    p = b.posn
    (p.x > 0) and (p.x < WIDTH) and
    (p.y > 0) and (p.y < HEIGHT)
  end
end

a = ask: 
| x == 4 then: 43
| x < 1 then: 1
end

a = ask: 
| x == 4 then: 43
| otherwise: 1
end

f = lam(x): x + 1 end
x = 1
a = x + 1

ask: | x == 3 then: 3| x == 5 then: 5 end

fun f(x): 
  y = x - 10 
  z = x - 10 
  y
end

reactor:
  seconds-per-tick: 0.1,
  title: "Count by 10",
  on-tick: tencrement,
  init: 10,
end

a = lam(n :: Number) -> Number:
  y = n + 1
  z = y * 2
  z
end

fun add(n :: Number) -> Number:
  fun sub(num :: Number) -> Number:
    num - 1
  end
  n + 1
end

when x > 1:
  y = x + 5
  y
end


check "test message": 
  3 is 3
  foo-bar-baz() is 12345
  3 is-not 4
  5 is=~ 5.000001
end

if x == 3: 4
else: 5
end

ask:
| x == 3 then:
y = x + 1
y
| x == 1 then:
z = x + 2
z
| otherwise: x
end

if x > 5:
  y = x + 1
  z = y + 1
  z
else:
  x
end
#|
|#





# ########################################################## 
# # include Libraries we want
# include shared-gdrive("Bootstrap-DataScience-v1.5.arr", "1btFfKCcas4zkQ6-SYCYMkcDCqmduzQqB")
# # include Google Sheets and Tables library
# include gdrive-sheets
# include tables
# include image


# #########################################################
# # Load your spreadsheet and define your table
# ri-schools-sheet = load-spreadsheet("1XeeyAuF_mtpeCw2HVCKjvwW1rreNvztoQ3WeBlEaDl0")

# schools-table = load-table: district, school, ela-passing, math-passing, is-charter, free-lunch, reduced-lunch, native, pacific-islander, hispanic, black, white, multi-racial, male, female, total-pop
#   source: ri-schools-sheet.sheet-by-name("2018", true)
# end



# ######################################################### 
# # Define some rows
# barringtonHS = schools-table.row-n(0)
# coltAndrewsES = schools-table.row-n(12)



# ######################################################### 
# # Define some helper functions

# # is-charter :: (r :: Row) -> Boolean
# fun is-charter(r): r["is-charter"] == "Yes" end




# # is-public :: (r :: Row) -> Boolean
# fun is-public(r): r["is-charter"] == "No" end



# # is-HS :: (r :: Row) -> Boolean
# fun is-HS(r): string-contains(r["school"], "HS") end


# # pct-poverty :: (r :: Row) -> Number
# fun pct-poverty(r): 
#   (r["free-lunch"] + r["reduced-lunch"]) / r["total-pop"] 
# end


# # pct-female :: (r :: Row) -> Number
# fun pct-female(r): r["female"] / r["total-pop"] end

# # high-ela :: (r :: Row) -> Boolean
# fun high-ela(r): r["ela-passing"] > 0.5 end

# # pct-nonwhite :: (r :: Row) -> Number
# fun pct-nonwhite(r): 
# (r["total-pop"] - r["white"]) / r["total-pop"] end

# ##########################################################
# # 1) Sort the schools-table by population, in ascending order

# # 2) Sort the schools-table by % passing ELA, in descending order

# # 3) Filter the schools-table to show only charter schools

# # 4) Filter the schools-table to show only public schools

# # 5) Filter the schools-table to show only high schools

# # 6) Build a column called "pct-poverty", which shows the % of students in each school who qualify for free or reduced lunch




# ######################################################### 
# # Define random and grouped samples



# #########################################################
# # Data Displays

# ### Make a pie chart showing schools that have high 
# ### passing rates in ELA vs. low ELA

# # which rows?          -- every school
# # which columns?       -- strong-ela
# schools-with-ELA = schools-table.build-column("strong-ela", high-ela)
# # what display?
# # pie-chart(schools-with-ELA, "strong-ela")


# ### Compare those pie charts for charters v. public schools

# # which rows?
# # which columns?
# # what display?

# ### Make a histogram showing distribution of sexes
# ### across all schools

# # which rows?
# # which columns?
# # what display?

# ### Make a histogram showing distribution of poverty
# ### across public high-schools 
# # which rows    -- public high schools
# # which columns -- pct-poverty
# poverty = schools-table
#   .filter(is-HS)
#   .filter(is-public)
#   .build-column("pct-poverty", pct-poverty)

# ### Make a histogram showing distribution of nonwhite
# ### students across public high-school 

# # which rows?       -- public high schools
# # which columns?    -- pct-nonwhite
# # what display?     -- histogram



# ### Make a histogram showing distribution of 
# ### % pass ela students across public high-school 

# # which rows?       -- public high schools
# # which columns?    -- ela-passing
# # what display?     -- histogram
# ela = schools-table
#   .filter(is-public)
#   .filter(is-HS)


# math = schools-table
#   .filter(is-public)
#   .filter(is-HS)















