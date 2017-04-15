function wrapQuotes(value) {
  return "{0}{1}{0}".format("'", value);
}

function toTimeStamp(value) {
  return "{0}('01 Jan {1}', 'DD Mon YYYY')".format("to_timestamp", value);
}

function toString(value) {
  return "{0}::text".format(value);
}

function wrapPercents(value) {
  return "UPPER ('%{0}%')".format(value.toString().toLowerCase());
}

function upperString(value) {
  return "UPPER({0})".format(value);
}

function nothingToDo(value) {
  return value;
}


var typesConversion = {
  "integer": {
    "name": {
      ">": nothingToDo,
      "<": nothingToDo,
      "=": nothingToDo,
      "!=": nothingToDo,
      "like": toString
    },
    "relation": {
      "<": nothingToDo,
      ">": nothingToDo,
      "=": nothingToDo,
      "!=": nothingToDo,
      "like": nothingToDo
    },
    "value": {
      "<": nothingToDo,
      ">": nothingToDo,
      "=": nothingToDo,
      "!=": nothingToDo,
      "like": wrapPercents

    }
  },

  "smallint": {
    "name": {
      ">": nothingToDo,
      "<": nothingToDo,
      "=": nothingToDo,
      "!=": nothingToDo,
      "like": toString
    },
    "relation": {
      "<": nothingToDo,
      ">": nothingToDo,
      "=": nothingToDo,
      "!=": nothingToDo,
      "like": nothingToDo
    },
    "value": {
      "<": nothingToDo,
      ">": nothingToDo,
      "=": nothingToDo,
      "!=": nothingToDo,
      "like": wrapPercents

    }
  },
  "numeric": {
    "name": {
      ">": nothingToDo,
      "<": nothingToDo,
      "=": nothingToDo,
      "!=": nothingToDo,
      "like": toString
    },
    "relation": {
      "<": nothingToDo,
      ">": nothingToDo,
      "=": nothingToDo,
      "!=": nothingToDo,
      "like": nothingToDo
    },
    "value": {
      "<": nothingToDo,
      ">": nothingToDo,
      "=": nothingToDo,
      "!=": nothingToDo,
      "like": wrapPercents

    }
  },
  "real": {
    "name": {
      ">": nothingToDo,
      "<": nothingToDo,
      "=": nothingToDo,
      "!=": nothingToDo,
      "like": toString
    },
    "relation": {
      "<": nothingToDo,
      ">": nothingToDo,
      "=": nothingToDo,
      "!=": nothingToDo,
      "like": nothingToDo
    },
    "value": {
      "<": nothingToDo,
      ">": nothingToDo,
      "=": nothingToDo,
      "!=": nothingToDo,
      "like": wrapPercents

    }
  },


  "character": {
    "name": {
      "<": nothingToDo,
      ">": nothingToDo,
      "=": nothingToDo,
      "!=": nothingToDo,
      "like": upperString
    },
    "relation": {
      "<": nothingToDo,
      ">": nothingToDo,
      "=": nothingToDo,
      "!=": nothingToDo,
      "like": nothingToDo
    },
    "value": {
      "<": wrapQuotes,
      ">": wrapQuotes,
      "=": wrapQuotes,
      "!=": wrapQuotes,
      "like": wrapPercents
    }
  },

  "character varying": {
    "name": {
      "<": nothingToDo,
      ">": nothingToDo,
      "=": nothingToDo,
      "!=": nothingToDo,
      "like": upperString
    },
    "relation": {
      "<": nothingToDo,
      ">": nothingToDo,
      "=": nothingToDo,
      "!=": nothingToDo,
      "like": nothingToDo
    },
    "value": {
      "<": wrapQuotes,
      ">": wrapQuotes,
      "=": wrapQuotes,
      "!=": wrapQuotes,
      "like": wrapPercents
    }
  },

  "timestamp without time zone": {
    "name": {
      "<": nothingToDo,
      ">": nothingToDo,
      "=": nothingToDo,
      "!=": nothingToDo,
      "like": toString
    },
    "relation": {
      "<": nothingToDo,
      ">": nothingToDo,
      "=": nothingToDo,
      "!=": nothingToDo,
      "like": nothingToDo
    },
    "value": {
      "<": toTimeStamp,
      ">": toTimeStamp,
      "=": toTimeStamp,
      "!=": toTimeStamp,
      "like": wrapPercents
    }
  }
};

module.exports = typesConversion;