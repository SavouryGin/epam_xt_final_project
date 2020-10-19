// =====================================================================
// Ввод и вывод
// =====================================================================

var input = '';
var output = '';
var current = 0;

function read(str) {
  try {
    return fastread(str)
  } catch (err) {
    return 'error'
  }
}

function fastread(str) { return parse(scan(str)) }

function scan(str) {
  input = str;
  output = new Array(0);
  var cur = 0;
  var len = input.length;

  while (cur < len) {
    var charcode = input.charCodeAt(cur);
    if (charcode<=32) {cur++}
    else if (charcode===38) {output[output.length] = '&'; cur++}
    else if (charcode===40) {output[output.length] = 'lparen'; cur++}
    else if (charcode===41) {output[output.length] = 'rparen'; cur++}
    else if (charcode===44) {output[output.length] = 'comma'; cur++}
    else if (charcode===46) {output[output.length] = '.'; cur++}
    else if (charcode===58) {output[output.length] = ':'; cur++}
    else if (charcode===60) {cur = scanbothsym(cur)}
    else if (charcode===61) {cur = scanthussym(cur)}
    else if (charcode===91) {output[output.length] = '['; cur++}
    else if (charcode===93) {output[output.length] = ']'; cur++}
    else if (charcode===123) {output[output.length] = '{'; cur++}
    else if (charcode===124) {output[output.length] = '|'; cur++}
    else if (charcode===125) {output[output.length] = '}'; cur++}
    else if (charcode===126) {output[output.length] = '~'; cur++}
    else if (idcharp(charcode)) {cur = scansymbol(cur)} 
    else { throw 'error' }
  };
  return output
}

function scanbothsym(cur) {
  if (input.length>cur+1 && input.charCodeAt(cur+1)===61 &&
      input.length>cur+2 && input.charCodeAt(cur+2)===62) {
        output[output.length] = '<=>'; return cur+3
      };
  throw 'error'
}

function scanthussym(cur) {
  if (input.length > cur+1 && input.charCodeAt(cur+1) === 62) {
    output[output.length] = '=>'; return cur+2
  };
  throw 'error'
}

function scansymbol(cur) {
  var exp = '';
  while (cur<input.length) {
    if (idcharp(input.charCodeAt(cur))) {exp = exp + input[cur]; cur++
    } else { break }
  };
  if (exp != '') { output[output.length] = exp };
  return cur
}

function idcharp(charcode) {
  if (charcode >= 47 && charcode <= 56) {return true};
  if (charcode >= 65 && charcode <= 90) {return true};
  if (charcode >= 97 && charcode <= 122) {return true};
  if (charcode == 95) {return true};
  return false
}

// =====================================================================
// Парсинг выражений
// =====================================================================

var infixes = [':','&','|','=>','<=>']

var tokens = [':','~','&','|','=>','<=>','[',']','comma','lparen','rparen','.','{','}']

var precedence = [':','~','&','|','=>','<=>']

function parse(str) {
  input = str;
  current = 0;
  return parsexp('lparen','rparen')
}

function parsexp(lop, rop) {
  if (current>=input.length) { throw 'error' };
  var left = parseprefix(rop);
  while (current < input.length) {
    if (input[current]==='lparen') { 
      left = parseatom(left) 
    } else if (!find(input[current],infixes)) {
      return left
    } else if (precedencep(lop, input[current])) {
        return left
    } else {
      left = parseinfix(left,input[current],rop)
    }
  };
  return left
}

function parseatom(left) {
  current++;
  var exp = seq(left);

  if (input[current]==='rparen') { 
    current++; 
    return exp 
  };

  while (current < input.length) {
    exp.push(parsexp('comma','rparen'));
    if (input[current]==='rparen') {
      current++; 
      return exp
    } else if (input[current]==='comma') {
      current++
    } else { throw 'error' }
  };
  return exp
}

function parseprefix(rop) {
  var left = input[current];
  if (left==='~') {return parsenegation(rop)};
  if (left==='{') {return parseclause()};
  if (left==='[') {return parseskolem()};
  if (left==='lparen') {return parseparenexp()};
  if (identifierp(left)) { 
    current++; 
    return left
  };
  throw 'error'
}

function parsenegation(rop) {
  current++;
  return makenegation(parsexp('~', rop))
}

function parseclause() {
  current++;
  var exp = seq('clause');
  if (input[current]==='}') {
    current++; 
    return exp
  };
  while (current < input.length) {
    exp.push(parsexp('comma','rparen'));
    if (input[current]==='}') { 
      current++; 
      return exp
    } else if (input[current]==='comma') {
      current++
    } else {throw 'error'}
  };
  return exp
}

function parseskolem() {
  current++;
  if (input[current]===']') { throw 'error' };
  var sk = parsexp('comma','comma');
  if (input[current]!==']') { throw 'error' };
  current++;
  return seq('skolem',sk)
}

function parseparenexp() {
  current++;
  var left = parsexp('lparen','rparen');
  current++;
  return left
}

function parseinfix(left, op, rop) {
  if (op == '&') { return parseand(left,rop) };
  if (op == '|') { return parseor(left,rop) };
  if (op == '=>') { return parseimplication(left,rop) };
  if (op == '<=>') { return parseequivalence(left,rop) };
  throw 'error'
}

function parseand(left, rop) {
  current++;
  return makeconjunction(left, parsexp('&', rop))
}

function parseor(left, rop) {
  current++;
  return makedisjunction(left, parsexp('|',rop))
}

function parseimplication (left, rop) {
  current++;
  return makeimplication(left,parsexp('=>', rop))
}

function parseequivalence(left, rop) {
  current++;
  return makeequivalence(left,parsexp('<=>',rop))
}

function identifierp (x) { return !find(x,tokens) }

function precedencep (lop, rop) {
  for (var i=0; i<precedence.length;i++) {
    if (precedence[i] === rop) { return false };
    if (precedence[i] === lop) { return true }
  };
  return false
}

function parenp(lop, op, rop) {
  return lop===op || op===rop || precedencep(lop,op) || precedencep(rop,op)
}

function prettify (str) {
  return str.replace('_',' ')
}

// =====================================================================
// Разбор выражний на подформулы
// =====================================================================

function grind (p) {return grindit(p, 'lparen', 'rparen') }

function grindit (p, lop, rop) {
  if (symbolp(p)) { return p };
  if (p[0] == 'equal') { return grindequality(p) };
  if (p[0] == 'skolem') { return grindskolem(p) };
  if (p[0] == 'not') { return grindnegation(p,rop) };
  if (p[0] == 'and') { return grindand(p,lop,rop) };
  if (p[0] == 'or') { return grindor(p,lop,rop) };
  if (p[0] == 'implication') { return grindimplication(p,lop,rop) };
  if (p[0] == 'equivalence') { return grindequivalence(p,lop,rop) };
  if (p[0] == 'clause') { return grindclause(p) };
  return grindatom(p)
}

function grindequality(p) { return grind(p[1]) + '=' + grind(p[2]) }

function grindatom(p) {
  var n = p.length;
  var exp = p[0] + '(';
  if (n>1) {exp += grind(p[1])};
  for (var i=2; i<n; i++) {
    exp = exp + ',' + grind(p[i])
  }
  exp += ')';
  return exp
}

function grindskolem(p) { return '[' + grind(p[1]) + ']' }

function grindnegation(p, rop) { return '~' + grindit(p[1],'~',rop) }

function grindand(p, lop, rop) {
  var exp = '';
  if (p.length == 1) { return 'false' };
  if (p.length == 2) { return grind(p[1], lop, rop) };
  var parens = parenp(lop, '&', rop);
  if (parens) { lop = 'lparen'; rop = 'rparen' };
  if (parens) { exp = '(' };
  exp = exp + grindit(p[1],lop,'&');
  for (var i=2; i<p.length-1; i++) {
    exp = exp + ' & ' + grindit(p[i],'&','&')
  };
  exp = exp + ' & ' + grindit(p[p.length-1],'&',rop);
  if (parens) {exp = exp + ')'};
  return exp
}

function grindor(p, lop, rop) {
  var exp = '';
  if (p.length == 1) { return 'false' };
  if (p.length == 2) { return grind(p[1], lop, rop) };
  var parens = parenp(lop,'|',rop);
  if (parens) { lop = 'lparen'; rop = 'rparen' };
  if (parens) { exp = '(' };
  exp = exp + grindit(p[1],lop,'|');
  for (var i=2; i<p.length-1; i++) {
    exp = exp + ' | ' + grindit(p[i],'|','|')
  };
  exp = exp + ' | ' + grindit(p[p.length-1],'|',rop);
  if (parens) { exp = exp + ')'};
  return exp
}

function grindimplication(p, lop, rop) {
  var exp = '';
  var parens = parenp(lop, '=>', rop);
  if (parens) { lop = 'lparen'; rop = 'rparen' };
  if (parens) { exp = '('};
  exp = exp + grindit(p[1],lop,'=>') + ' => ' + grindit(p[2],'=>',rop);
  if (parens) { exp = exp + ')' };
  return exp
}

function grindequivalence (p, lop, rop) {
  var exp = '';
  var parens = parenp(lop, '<=>', rop);
  if (parens) { lop = 'lparen'; rop = 'rparen' };
  if (parens) { exp = '(' };
  exp = exp + grindit(p[1], lop, '<=>') + ' <=> ' + grindit(p[2], '<=>', rop);
  if (parens) { exp = exp + ')'};
  return exp
}

function grindclause (p) {
  var exp = '{';
  if (p.length > 1) {exp = exp + grind(p[1])};
  for (var i=2; i<p.length; i++) {
    exp = exp + ',' + grind(p[i])
  };
  exp = exp + '}';
  return exp
}

function grindalist(al) {
  var exp = '';
  if (al == false) { return 'false' };
  for (var l=al; !nullp(l); l=cdr(l)) {
    exp = exp + car(car(l)) + ' = ' + grind(cdr(car(l))) + '\n'
  }
  return exp
}

// =====================================================================
// Обработка элементов формулы
// =====================================================================

var counter = 0;

function symbolp(x) {
  return typeof x == 'string'
}

function varp(x) {
  return typeof x === 'string' && x.length !==0 && x[0] !== x[0].toLowerCase()
}

function constantp(x) {
  return typeof x === 'string' && x.length !==0 && x[0] === x[0].toLowerCase()
}

function stringp (x) {
  return typeof x === 'string' && x.length > 1 && x[0] === '"' &&  x[x.length-1] === '"'
}

function newvar() {
  counter++; 
  return 'V' + counter
}

function newsym() {
  counter++; 
  return 'c' + counter
}

function seq() {
  var exp=new Array(arguments.length);
  for (var i=0; i<arguments.length; i++) {
    exp[i]=arguments[i]
  };
  return exp
}

function makeatom(r, x, y) {
  var exp = new Array(3);
  exp[0] = r;
  exp[1] = x;
  exp[2] = y;
  return exp
}

function makeequality(x, y) {
  return seq('equal',x,y)
}

function makenegation(p) {
  return seq('not',p)
}

function makeconjunction(p, q) {
  return seq('and', p, q)
}

function makedisjunction(p,q) {
  return seq('or', p, q)
}

function makeimplication (head, body) {
  return seq('implication', head, body)
}

function makeequivalence (head, body) {
  return seq('equivalence',head,body)
}

function makestep() {
  var exp=new Array(arguments.length+1);
  exp[0] = 'step';
  for (var i=0; i<arguments.length; i++) {
    exp[i+1]=arguments[i]
  };
  return exp
}

function makeproof() {
  var exp = new Array(1);
  exp[0] = 'proof';
  return exp
}

function equalp(p, q) {
  if (symbolp(p)) {
    if (symbolp(q)) { return p == q}  else { return false }
  };
  if (symbolp(q)) { return false };
  if (p.length != q.length) { return false };
  for (var i = 0; i < p.length; i++) {
    if (!equalp(p[i],q[i])) { return false }
  };
  return true
}

function empty() {
  return new Array(0)
}

function rest(l) {
  var m  = l.slice(1,l.length);
  return m
}

function adjoin(x, s) {
  if (!findq(x,s)) {
    s.push(x)};
  return s
}

function adjoinit(x, s) {
  if (find(x,s)) {
    return s
  } else {
    s[s.length] = x; 
    return s
  }
}

function findq(x, s) {
  for (var i = 0; i < s.length; i++) {
    if (x == s[i]) { return true }
  };
  return false
}

function find(x,s) {
  for (var i=0; i<s.length; i++) {
    if (equalp(x,s[i])) {return true}
  };
  return false
}

function subst(x, y, z) {
  if (z === y) { return x };
  if (symbolp(z)) { return z };
  var exp = new Array(z.length);
  for (var i=0; i<z.length; i++) {
    exp[i] = subst(x,y,z[i])
  }
  return exp
}

// =====================================================================
// Обработка списков
// =====================================================================

var nil = 'nil';

function nullp(l) { return l == 'nil' }

function cons(x, l) {
  var cell = new Array(2);
  cell[0] = x;
  cell[1] = l;
  return cell
}

function car(l) { return l[0] }

function cdr(l) { return l[1] }

function memberp (x, l) {
  if (nullp(l)) { return false };
  if (car(l) == x) { return true };
  if (memberp(x, cdr(l))) { return true };
  return false
}

function amongp (x, y) {
  if (symbolp(y)) { return x == y };
  for (var i = 0; i < y.length; i++) {
    if (amongp(x, y[i])) { return true }
  }
  return false
}

function acons(x, y, al) { return cons(cons(x, y), al) }

function assoc(x, al) {
  if (nullp(al)) { return false };
  if (x == car(car(al))) { return car(al) };
  return assoc(x, cdr(al))
}

