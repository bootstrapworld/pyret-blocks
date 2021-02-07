########################################################## 
# include Libraries we want
include shared-gdrive("Bootstrap-DataScience-v1.5.arr", "1btFfKCcas4zkQ6-SYCYMkcDCqmduzQqB")
# include Google Sheets and Tables library
include gdrive-sheets
include tables
include image


#########################################################
# Load your spreadsheet and define your table
ri-schools-sheet = load-spreadsheet("1XeeyAuF_mtpeCw2HVCKjvwW1rreNvztoQ3WeBlEaDl0")

schools-table = load-table: district, school, ela-passing, math-passing, is-charter, free-lunch, reduced-lunch, native, pacific-islander, hispanic, black, white, multi-racial, male, female, total-pop
  source: ri-schools-sheet.sheet-by-name("2018", true)
end



######################################################### 
# Define some rows
barringtonHS = schools-table.row-n(0)
coltAndrewsES = schools-table.row-n(12)



######################################################### 
# Define some helper functions

# is-charter :: (r :: Row) -> Boolean
fun is-charter(r): r["is-charter"] == "Yes" end




# is-public :: (r :: Row) -> Boolean
fun is-public(r): r["is-charter"] == "No" end



# is-HS :: (r :: Row) -> Boolean
fun is-HS(r): string-contains(r["school"], "HS") end


# pct-poverty :: (r :: Row) -> Number
fun pct-poverty(r): 
  (r["free-lunch"] + r["reduced-lunch"]) / r["total-pop"] 
end


# pct-female :: (r :: Row) -> Number
fun pct-female(r): r["female"] / r["total-pop"] end

# high-ela :: (r :: Row) -> Boolean
fun high-ela(r): r["ela-passing"] > 0.5 end

# pct-nonwhite :: (r :: Row) -> Number
fun pct-nonwhite(r): 
(r["total-pop"] - r["white"]) / r["total-pop"] end

##########################################################
# 1) Sort the schools-table by population, in ascending order

# 2) Sort the schools-table by % passing ELA, in descending order

# 3) Filter the schools-table to show only charter schools

# 4) Filter the schools-table to show only public schools

# 5) Filter the schools-table to show only high schools

# 6) Build a column called "pct-poverty", which shows the % of students in each school who qualify for free or reduced lunch




######################################################### 
# Define random and grouped samples



#########################################################
# Data Displays

### Make a pie chart showing schools that have high 
### passing rates in ELA vs. low ELA

# which rows?          -- every school
# which columns?       -- strong-ela
schools-with-ELA = schools-table.build-column("strong-ela", high-ela)
# what display?
# pie-chart(schools-with-ELA, "strong-ela")


### Compare those pie charts for charters v. public schools

# which rows?
# which columns?
# what display?

### Make a histogram showing distribution of sexes
### across all schools

# which rows?
# which columns?
# what display?

### Make a histogram showing distribution of poverty
### across public high-schools 
# which rows    -- public high schools
# which columns -- pct-poverty
poverty = schools-table
  .filter(is-HS)
  .filter(is-public)
  .build-column("pct-poverty", pct-poverty)

### Make a histogram showing distribution of nonwhite
### students across public high-school 

# which rows?       -- public high schools
# which columns?    -- pct-nonwhite
# what display?     -- histogram



### Make a histogram showing distribution of 
### % pass ela students across public high-school 

# which rows?       -- public high schools
# which columns?    -- ela-passing
# what display?     -- histogram
ela = schools-table
  .filter(is-public)
  .filter(is-HS)


math = schools-table
  .filter(is-public)
  .filter(is-HS)















