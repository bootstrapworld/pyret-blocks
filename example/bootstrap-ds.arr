load-table: name :: String, age :: Number, favorite-color :: String
  source: imported-my-table.sheet-by-name("3-rows", true)
  sanitize name using DS.string-sanitizer
  sanitize age using DS.strict-num-sanitizer
  sanitize favorite-color using DS.string-sanitizer
end

with-min-max = extend some-numbers using n:
  max :: Number: T.running-max of n,
  min :: Number: T.running-min of n
end