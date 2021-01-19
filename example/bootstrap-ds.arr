# include Libraries we want



fun is-minor(r): r["mode"] == 0 end

fun is-major(r): r["mode"] == 1 end

fun is-2017(r): r["year"] == 2017 end

fun is-2018(r): r["year"] == 2018 end

fun what-key(r):
  if r["key"] == 0.00:
    if r["mode"] == 1:
      "A Maj"
    else:
      "A Min"
    end
  else if r["key"] == 1.00:
    if r["mode"] == 1:
      "A#/Bb Maj"
    else:
      "A#/Bb min"
    end
  else if r["key"] == 2.00:
    if r["mode"] == 1:
      "B Maj"
    else:
      "B min"
    end
  else if r["key"] == 3.00:
    if r["mode"] == 1:
      "C Maj"
    else:
      "C min"
    end
  else if r["key"] == 4.00:
    if r["mode"] == 1:
      "C#/Db maj"
    else:
      "C#/Db min"
    end
  else if r["key"] == 5.00:
    if r["mode"] == 1:
      "D Maj"
    else:
      "D min"
    end
  else if r["key"] == 6.00:
    if r["mode"] == 1:
      "D#/Eb Maj"
    else:
      "D#/Eb min"
    end
  else if r["key"] == 7.00:
    if r["mode"] == 1:
      "E Maj"
    else:
      "E min"
    end
  else if r["key"] == 8.00:
    if r["mode"] == 1:
      "F Maj"
    else:
      "F min"
    end
  else if r["key"] == 9.00:
    if r["mode"] == 1:
      "F#/Gb Maj"
    else:
      "F#/Gb min"
    end
  else if r["key"] == 10.00:
    if r["mode"] == 1:
      "G Maj"
    else:
      "G min"
    end
  else if r["key"] == 11.00:
    if r["mode"] == 1:
      "G#/Ab Maj"
    else:
      "G#/Ab min"
    end
  else:
    "problem"
  end
end