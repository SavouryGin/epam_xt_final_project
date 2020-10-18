// =====================================================================
// Глобальные объекты и переменные
// =====================================================================

var proof = makeproof();
var cursor = false;
var oldproof = makeproof();
var oldcursor = false;

// =====================================================================
// Инициализация приложения
// =====================================================================

function doinitialize() {
    proof = archivetoproof(document.getElementsByTagName('proof')[0]);
    cursor = false;
    showproof(proof)
}

function archivetoproof(archive) {
    var proof = seq('proof');
    stepnumber = 0;
    for (var i = 1; i < archive.childNodes.length; i++) {
        if (archive.childNodes[i].nodeName === 'STEP') {
            stepnumber = stepnumber + 1;
            var step = archivetostep(stepnumber, archive.childNodes[i]);
            proof[proof.length] = step
        }
    };
    return proof
}

function archivetostep(n, archive) {
    var sentence = getsubnode(archive, 'SENTENCE').textContent;
    var justification = getsubnode(archive, 'JUSTIFICATION').textContent;
    var step = seq('step', n, read(sentence), justification);

    for (var i = 0; i < archive.childNodes.length; i++) {
        if (archive.childNodes[i].nodeName === 'ANTECEDENT') {
            step[step.length] = archive.childNodes[i].textContent * 1
        }
    };
    return step
}

function getsubnode(node, tag) {
    for (var i = 0; i < node.childNodes.length; i++) {
        if (node.childNodes[i].nodeName === tag) {
            return node.childNodes[i]
        }
    };
    return false
}

// =====================================================================
// Отображение доказательства в таблице
// =====================================================================

function showproof(proof) {
    var area = document.getElementById('proof');
    var n = area.childNodes.length;
    for (var i = 0; i < n; i++) {
        area.removeChild(area.childNodes[0])
    };
    area.appendChild(displayproof(proof));
    showbuttons()
}

function displayproof(proof) {
    var table = document.createElement('table');
    table.setAttribute('width', '720');
    table.setAttribute('cellpadding', '0');
    table.setAttribute('cellspacing', '0');
    table.setAttribute('border', '0');
    table.setAttribute('style', "white-space:nowrap");
    displayfirst(1, table);
    displaysteps(1, proof, table);
    if (cursor === false) {
        displayempty(prooflevel(proof), table)
    };
    return table
}

function displayfirst(level, table) {
    var row = table.insertRow(table.rows.length)
    row.setAttribute('height', '30');
    var cell = row.insertCell(0);
    cell.setAttribute('width', 20);
    var widget = document.createElement('input');
    widget.setAttribute('type', 'checkbox');
    widget.setAttribute('onclick', 'doselectall(this)');
    cell.appendChild(widget);
    cell = row.insertCell(1);
    cell.setAttribute('width', 30);
    cell = row.insertCell(2);
    cell.setAttribute('width', 450);
    cell.appendChild(displaybarredelement(level, '<span style="color: #C6CB41">Выбрать все</span>'));
    cell = row.insertCell(3);
    cell.setAttribute('width', 220);
    return true
}

function displaysteps(level, proof, table) {
    var disabled = false;
    for (var i = 1; i < proof.length; i++) {
        if (table.rows.length === cursor) { disabled = true };
        if (table.rows.length === cursor) { displayempty(level, table) };
        if (proof[i][3] === 'Гипотеза') { level = level + 1 };
        if (proof[i][3] === 'Введение импликации') { level = level - 1 };
        if (disabled) {
            displaygrey(level, proof[i], table);
            continue
        };
        displaystep(level, proof[i], table)
    };
    return true
}

function displaystep(level, item, table) {
    var row = table.insertRow(table.rows.length);
    row.setAttribute('height', '30');
    var cell = row.insertCell(0);
    cell.setAttribute('width', 20);
    var widget = document.createElement('input');
    widget.setAttribute('id', item[1]);
    widget.setAttribute('type', 'checkbox');
    cell.appendChild(widget);
    cell = row.insertCell(1);
    cell.setAttribute('width', 30);
    cell.setAttribute('style', 'cursor:pointer');
    cell.setAttribute('onclick', 'doselect(this)');
    cell.innerHTML = item[1] + '.';
    cell = row.insertCell(2);
    cell.setAttribute('width', 450);
    cell.appendChild(displaybarredelement(level, grind(item[2])));
    cell = row.insertCell(3);
    cell.setAttribute('width', 220);
    var just = '&nbsp;' + item[3];

    if (item.length > 4) {
        just += ': ' + item[4];
        for (var j = 5; j < item.length; j++) {
            just += ', ' + item[j]
        }
    };
    cell.innerHTML = just;
    return true
}

function displaygrey(level, item, table) {
    var row = table.insertRow(table.rows.length);
    row.setAttribute('height', '30');
    var cell = row.insertCell(0);
    cell.setAttribute('width', 20);
    var widget = document.createElement('input');
    widget.setAttribute('id', item[1]);
    widget.setAttribute('type', 'checkbox');
    widget.setAttribute('disabled', true);
    cell.appendChild(widget);
    cell = row.insertCell(1);
    cell.setAttribute('width', 30);
    cell.setAttribute('style', 'cursor:pointer');
    cell.setAttribute('onclick', 'doselect(this)');
    cell.innerHTML = item[1] + '.';
    cell = row.insertCell(2);
    cell.setAttribute('width', 450);
    cell.appendChild(displaybarredelement(level, grind(item[2])));
    cell = row.insertCell(3);
    cell.setAttribute('width', 220);
    var just = '&nbsp;' + item[3];

    if (item.length > 4) {
        just += ': ' + item[4];
        for (var j = 5; j < item.length; j++) {
            just += ', ' + item[j]
        }
    };
    cell.innerHTML = just;
    return true
}

function displayempty(level, table) {
    var row = table.insertRow(table.rows.length)
    row.setAttribute('height', '30');
    row.setAttribute('onclick', 'deselect(this)');
    var cell = row.insertCell(0);
    cell.setAttribute('width', 20);
    cell = row.insertCell(1);
    cell.setAttribute('width', 30);
    cell = row.insertCell(2);
    cell.setAttribute('width', 450);
    cell.appendChild(displaybarredelement(level, ''));
    cell = row.insertCell(3);
    cell.setAttribute('width', 220);
    return true
}

function displaybarredelement(level, stuff) {
    var table = document.createElement('table');
    table.setAttribute('cellspacing', '0');
    table.setAttribute('cellpadding', '0');
    table.setAttribute('style', "white-space:nowrap");
    var row = table.insertRow(0);
    row.setAttribute('height', '30');
    for (var i = level; i > 0; i--) {
        var cell = row.insertCell(row.cells.length);
        cell.setAttribute('style', 'border-left:2px solid  #EE9D28; padding: 5px');
        cell.innerHTML = '&nbsp;'
    };
    var cell = row.insertCell(row.cells.length);
    cell.innerHTML = stuff;
    cell = row.insertCell(1);
    cell.innerHTML = '&nbsp;';
    return table
}

function prooflevel(proof) {
    var level = 1;
    for (var i = 1; i < proof.length; i++) {
        if (proof[i][3] === 'Гипотеза') { level = level + 1 };
        if (proof[i][3] === 'Введение импликации') { level = level - 1 }
    };
    return level
}

// =====================================================================
// Отображение кнопок правил вывода
// =====================================================================

function showbuttons() {
    if (prooflevel(proof) === 1) {
        document.getElementById('doii').disabled = true
    } else {
        document.getElementById('doii').disabled = false
    };

    if (cursor !== false) {
        document.getElementById('doreiteration').disabled = true;
        document.getElementById('dodelete').disabled = true;
        document.getElementById('doassumption').disabled = true;
        document.getElementById('doni').disabled = true;
        document.getElementById('done').disabled = true;
        document.getElementById('doai').disabled = true;
        document.getElementById('doae').disabled = true;
        document.getElementById('dooi').disabled = true;
        document.getElementById('dooe').disabled = true;
        document.getElementById('doii').disabled = true;
        document.getElementById('doie').disabled = true;
        document.getElementById('dobi').disabled = true;
        document.getElementById('dobe').disabled = true;
    } else {
        document.getElementById('doreiteration').disabled = false;
        document.getElementById('dodelete').disabled = false;
        document.getElementById('doassumption').disabled = false;
        document.getElementById('doni').disabled = false;
        document.getElementById('done').disabled = false;
        document.getElementById('doai').disabled = false;
        document.getElementById('doae').disabled = false;
        document.getElementById('dooi').disabled = false;
        document.getElementById('dooe').disabled = false;
        document.getElementById('doie').disabled = false;
        document.getElementById('dobi').disabled = false;
        document.getElementById('dobe').disabled = false;
    };

    return true
}

// =====================================================================
// Отмена последнего шага доказательства
// =====================================================================

function doundo() {
    var style = 'color:#EE9D28; cursor:text';
    document.getElementById('doundo').setAttribute('style', style);
    proof = oldproof;
    cursor = oldcursor;
    showproof(proof)
}

function dobackup() {
    oldproof = deepcopy(proof);
    oldcursor = cursor;
    var style = 'color:#7AC0FF; cursor:pointer';
    document.getElementById('doundo').setAttribute('style', style)
}

function deepcopy(x) {
    if (!(x instanceof Array)) { return x };
    var out = new Array(x.length)
    for (var i = 0; i < x.length; i++) {
        out[i] = deepcopy(x[i])
    };
    return out
}

// =====================================================================
// Копирование части/всего доказательства
// =====================================================================

function docopyall() {
    localStorage.clipboard = JSON.stringify(proof);
    alert('Доказательство скопировано в буфер обмена.')
    return true
}

function docopy() {
    var steps = getcheckedsteps(proof);
    var concordance = {};
    var subproof = seq('proof');
    for (var i = 0; i < steps.length; i++) {
        var step = copystep(proof[steps[i]]);
        concordance[step[1]] = i + 1;
        step[1] = i + 1;
        for (var j = 4; j < step.length; j++) {
            var num = concordance[step[j]];
            if (!num) {
                step[3] = 'Посылка';
                step.length = 4;
                break
            };
            step[j] = num
        };
        subproof[i + 1] = step
    };
    localStorage.clipboard = JSON.stringify(subproof);
    alert('Выбранные шаги доказательства скопированы в буфер обмена.')
    return true
}

function copystep(step) {
    var newstep = seq();
    for (var j = 0; j < step.length; j++) {
        newstep[j] = step[j]
    };
    return newstep
}

// =====================================================================
// Вставка части/всего доказательства
// =====================================================================

function dopaste() {
    dobackup();
    var clipboard = getclipboard();
    var num = stepnum(cursor, proof);
    paste(clipboard, proof, num);
    cursor = false;
    showproof(proof);
    return true
}

function getclipboard() {
    if (localStorage.clipboard === undefined) {
        return seq('proof')
    };
    return JSON.parse(localStorage.clipboard)
}

function paste(clip, proof, num) {
    for (var i = 1; i < clip.length; i++) {
        proof.splice(num + i - 1, 0, copyrow(num, num + i - 1, clip[i]))
    };
    updateproof(num, clip.length - 1, proof);
    return true
}

function copyrow(step, num, row) {
    var newrow = seq('step', num, row[2], row[3]);
    for (var j = 4; j < row.length; j++) {
        newrow[j] = row[j] + step - 1
    };
    return newrow
}

function doapply() {
    var steps = getcheckedsteps(proof);
    var clipboard = getclipboard();
    if (clipboard.length === 1) {
        alert('Буфер обмена пуст.');
        return false
    };
    var premises = getpremises(clipboard);
    var conclusion = clipboard[clipboard.length - 1][2];
    var supports = getsupports(clipboard, premises, proof, steps);
    if (supports === false) {
        alert('Выбранные шаги не соответствуют посылкам в буфере обмена.');
        return false
    };
    dobackup();
    var num = stepnum(cursor, proof);
    var row = makestep(num, conclusion, 'Subproof').concat(supports);
    proof.splice(num, 0, row);
    updateproof(num, 1, proof);
    if (cursor) { cursor = cursor + 1 };
    showproof(proof);
    return true
}

function getpremises(proof) {
    var steps = seq();
    for (var i = 1; i < proof.length; i++) {
        if (proof[i][3] === 'Посылка') {
            steps[steps.length] = i
        }
    };
    return steps
}

function getsupports(clipboard, premises, proof, steps) {
    var supports = [];
    for (var i = 0; i < premises.length; i++) {
        var step = getstep(clipboard[premises[i]][2], proof, steps);
        if (!step) { return false };
        supports[i] = step
    };
    return supports
}

function getstep(p, proof, steps) {
    for (var i = 0; i < steps.length; i++) {
        if (equalp(proof[steps[i]][2], p)) {
            return steps[i]
        }
    }
    return false
}

// =====================================================================
// Загрузка доказательства
// =====================================================================

function doload() {
    document.getElementById('operation').style.display = '';
    return true
}

function dofileselect(fileobj) {
    var reader = new FileReader();
    reader.onload = handleload;
    reader.readAsText(fileobj.files[0]);
    return true
}

function handleload(evt) {
    var fileobj = document.getElementById('selector').files[0];
    var filename = fileobj.name;
    var filetype = fileobj.type;
    document.getElementById('proof').innerHTML = evt.target.result;
    unload();
    dobackup();
    doinitialize()
}

function unload() {
    document.getElementById('operation').style.display = 'none'
}

// =====================================================================
// Сохранение доказательства
// =====================================================================

function dosave() {
    document.getElementById('operation').style.display = '';
    return true
}

function dosave() {
    if ('Blob' in window) {
        var fileName = prompt('Введите имя файла', 'myproof.xml');
        if (fileName) {
            var textToWrite = xmlifyproof().replace(/\n/g, '\r\n');
            var textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });

            if ('msSaveOrOpenBlob' in navigator) {
                navigator.msSaveOrOpenBlob(textFileAsBlob, fileName);
            } else {
                var downloadLink = document.createElement('a');
                downloadLink.download = fileName;
                downloadLink.innerHTML = 'Download File';
                if ('webkitURL' in window) {
                    // Chrome
                    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
                } else {
                    // Firefox
                    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                    downloadLink.onclick = destroyClickedElement;
                    downloadLink.style.display = 'none';
                    document.body.appendChild(downloadLink)
                }
                downloadLink.click()
            }
        }
    } else {
        alert('Ваш браузер не поддерживает сохранение доказательства в файл.')
    }
}

function destroyClickedElement(event) {
    document.body.removeChild(event.target)
}

// =====================================================================
// Перевод доказательства в формат xml
// =====================================================================

function doxml() {
    var win = window.open();
    win.document.writeln('<xmp>');
    cursor = 0;
    win.document.write(xmlize(proof, 0));
    win.document.writeln('</xmp>');
    win.document.close()
}

function xmlifyproof() {
    step = 0;
    return xmlize(proof, 0)
}

function xmlize(item, n) {
    if (item[0] == 'step') { return xmlstep(item, n) };
    if (item[0] == 'proof') { return xmlproof(item, n) };
    return ''
}

function xmlstep(line, n) {
    step = step + 1;
    var exp = '';
    exp += spaces(n) + '<step>\n';
    exp += spaces(n) + '  <number>' + step + '</number>\n';
    exp += spaces(n) + '  <sentence>' + grind(line[2]) + '</sentence>\n';
    exp += spaces(n) + '  <justification>' + prettify(line[3]) + '</justification>\n';
    for (var j = 4; j < line.length; j++) {
        exp += spaces(n) + '  <antecedent>' + line[j] + '</antecedent>\n'
    };
    exp += spaces(n) + '</step>\n';
    return exp
}

function xmlproof(proof, n) {
    var exp = '';
    exp += spaces(n) + '<proof>\n';
    for (var i = 1; i < proof.length; i++) {
        exp += xmlize(proof[i], n + 1)
    };
    exp += spaces(n) + '</proof>\n';
    return exp
}

function spaces(n) {
    exp = '';
    for (var i = 0; i < n; i++) {
        exp += '  '
    };
    return exp
}

// =====================================================================
// Выбор шагов доказательства/поддоказательства
// =====================================================================

function doselectall(node) {
    if (event.altKey && event.shiftKey) {
        doselectsupport();
        doselectflip();
        node.checked = allselectedp(proof);
        return false
    };
    if (event.altKey) {
        doselectflip();
        node.checked = allselectedp(proof);
        return false
    };
    if (event.shiftKey) {
        doselectsupport();
        node.checked = allselectedp(proof);
        return false
    };
    var parity = node.checked;
    for (var i = 1; i < proof.length; i++) {
        document.getElementById(i).checked = parity
    };
    return true
}

function doselectflip() {
    for (var i = 1; i < proof.length; i++) {
        var widget = document.getElementById(i);
        widget.checked = !widget.checked
    };
    return true
}

function doselectsupport() {
    for (var i = 1; i < proof.length; i++) {
        if (document.getElementById(i).checked) {
            selectsupport(i, proof)
        }
    };
    return true
}

function selectsupport(step, proof) {
    document.getElementById(step).checked = true;
    for (var j = 4; j < proof[step].length; j++) {
        selectsupport(proof[step][j], proof)
    };
    return true
}

function allselectedp(proof) {
    for (var i = 1; i < proof.length; i++) {
        if (!document.getElementById(i).checked) { return false }
    };
    return true
}

function doselect(cell) {
    cursor = cell.textContent * 1;
    showproof(proof);
    return false
}

function deselect(row) {
    cursor = false;
    showproof(proof);
    return false
}

// =====================================================================
// Добавление посылки
// =====================================================================

function dopremise() {
    document.getElementById('premise').style.display = '';
    document.getElementById('newpremise').focus()
}

function addpremise() {
    dobackup();
    var exp = read(document.getElementById('newpremise').value);
    if (exp === 'error') {
        alert('Синтаксическая ошибка'); return false
    };
    document.getElementById('premise').style.display = 'none';
    var num = stepnum(cursor, proof);
    proof.splice(num, 0, makestep(num, exp, 'Посылка'));
    updateproof(num, 1, proof);
    if (cursor) {
        cursor = cursor + 1
    };
    showproof(proof)
}

function stepnum(step, proof) {
    if (step) {
        return step
    } else {
        return proof.length
    }
}

function updateproof(step, num, proof) {
    for (var i = step + num; i < proof.length; i++) {
        var row = proof[i];
        row[1] = row[1] + num;
        for (var j = 4; j < row.length; j++) {
            if (row[j] >= step) { row[j] = row[j] + num }
        }
    };
    return true
}

function unpremise() {
    document.getElementById('premise').style.display = 'none'
}

// =====================================================================
// Добавление гипотезы
// =====================================================================

function doassumption() {
    document.getElementById('assumption').style.display = '';
    document.getElementById('newassumption').focus()
}

function addassumption() {
    dobackup();
    var exp = read(document.getElementById('newassumption').value);
    if (exp === 'error') {
        alert('Синтаксическая ошибка');
        return false
    };
    document.getElementById('assumption').style.display = 'none';
    proof[proof.length] = makestep(proof.length, exp, 'Гипотеза');
    showproof(proof)
}

function unassumption() {
    document.getElementById('assumption').style.display = 'none'
}

// =====================================================================
// Повторение шага доказательства
// =====================================================================

function doreiteration() {
    var steps = getcheckedpremises(proof);
    if (steps.length === 0) {
        alert('Выберите шаг доказательства для повторения.');
        return false
    };
    var num = stepnum(cursor, proof);
    for (var i = 0; i < steps.length; i++) {
        var row = makestep(num + i, proof[steps[i]][2], 'Повтор', steps[i]);
        proof.splice(num + i, 0, row)
    };
    updateproof(num, steps.length, proof);
    if (cursor) { cursor = cursor + 1 };
    showproof(proof);
    return true
}

// =====================================================================
// Замена символа в доказательстве
// =====================================================================

function doreplace() {
    document.getElementById('replace').style.display = '';
    document.getElementById('oldexpression').focus();
    return true
}

function doreplacement() {
    dobackup();
    var oldexp = read(document.getElementById('oldexpression').value);
    var newexp = read(document.getElementById('newexpression').value);
    if (oldexp === 'error') {
        alert('Синтаксическая ошибка!');
        return false
    };
    if (newexp === 'error') {
        alert('Синтаксическая ошибка!');
        return false
    };
    for (var i = 1; i < proof.length; i++) {
        proof[i][2] = subst(newexp, oldexp, proof[i][2])
    };
    showproof(proof);
    unreplace();
    return true
}

function unreplace() {
    document.getElementById('replace').style.display = 'none'
}

// =====================================================================
// Удаление шага/шагов из доказательства
// =====================================================================

function dodelete() {
    dobackup();
    proof = getnewproof(proof);
    cursor = false;
    showproof(proof);
    return true
}

function getnewproof(proof) {
    var concordance = seq(0);
    var newproof = makeproof();
    var newstep = 0;
    for (var i = 1; i < proof.length; i++) {
        if (document.getElementById(i).checked || !checksupport(proof[i], concordance)) {
            concordance[i] = false
        } else {
            newstep = newstep + 1;
            concordance[i] = newstep;
            updatesupport(proof[i], concordance);
            newproof[newproof.length] = proof[i]
        }
    };
    return newproof
}

function checksupport(step, concordance) {
    for (var j = 4; j < step.length; j++) {
        if (!concordance[step[j]]) {
            return false
        }
    };
    return true
}

function updatesupport(step, concordance) {
    step[1] = concordance[step[1]];
    for (var j = 4; j < step.length; j++) {
        step[j] = concordance[step[j]]
    };
    return true
}

// =====================================================================
// Введение отрицания
// =====================================================================

function doni() {
    var steps = getcheckedpremises(proof);
    if (steps.length == 0) {
        alert('Не выбрано совместимых с правилом вывода шагов доказательства.');
        return false
    };
    dobackup();
    for (var i = 0; i < steps.length; i++) {
        for (var j = 0; j < steps.length; j++) {
            var result = ni(proof[steps[i]][2], proof[steps[j]][2]);
            if (result != false) {
                var num = stepnum(cursor, proof);
                var newstep = makestep(num, result, 'Введение отрицания', steps[i], steps[j]);
                proof.splice(num, 0, newstep);
                updateproof(num, 1, proof);
                if (cursor) { cursor = cursor + 1 }
            }
        }
    };
    showproof(proof);
    return true
}

function ni(p, q) {
    if (!symbolp(p)
        && p[0] == 'implication'
        && !symbolp(q)
        && q[0] == 'implication'
        && equalp(p[1], q[1])
        && complementaryp(p[2], q[2])) {
        return makenegation(p[1])
    };
    return false
}

function complementaryp(p, q) {
    return (!symbolp(q) && q[0] == 'not' && equalp(p, q[1]))
}

// =====================================================================
// Удаление отрицания
// =====================================================================

function done() {
    var steps = getcheckedpremises(proof);
    if (steps.length == 0) {
        alert('Не выбрано совместимых с правилом вывода шагов доказательства.');
        return false
    };
    dobackup();
    for (var i = 0; i < steps.length; i++) {
        var result = ne(proof[steps[i]][2]);
        if (result != false) {
            var num = stepnum(cursor, proof);
            var newstep = makestep(num, result, 'Удаление отрицания', steps[i]);
            proof.splice(num, 0, newstep);
            updateproof(num, 1, proof);
            if (cursor) { cursor = cursor + 1 }
        }
    };
    showproof(proof);
    return true
}

function ne(p) {
    if (!symbolp(p)
        && p[0] === 'not'
        && !symbolp(p[1])
        && p[1][0] === 'not') {
        return p[1][1]
    } else {
        return false
    }
}

// =====================================================================
// Введение конъюнкции
// =====================================================================

function doai() {
    var steps = getcheckedpremises(proof);
    if (steps.length == 0) {
        alert('Не выбрано совместимых с правилом вывода шагов доказательства.');
        return false
    };
    dobackup();
    for (var i = 0; i < steps.length; i++) {
        for (var j = 0; j < steps.length; j++) {
            var result = ai(proof[steps[i]][2], proof[steps[j]][2]);
            if (result != false) {
                var num = stepnum(cursor, proof);
                var newstep = makestep(num, result, 'Введение конъюнкции', steps[i], steps[j]);
                proof.splice(num, 0, newstep);
                updateproof(num, 1, proof);
                if (cursor) { cursor = cursor + 1 }
            }
        }
    };
    showproof(proof);
    return true
}

function ai(p, q) {
    return makeconjunction(p, q)
}

// =====================================================================
// Удаление конъюнкции
// =====================================================================

function doae() {
    var steps = getcheckedpremises(proof);
    if (steps.length == 0) {
        alert('Не выбрано совместимых с правилом вывода шагов доказательства.');
        return false
    };
    dobackup();
    for (var i = 0; i < steps.length; i++) {
        var results = ae(proof[steps[i]][2]);
        for (var j = 0; j < results.length; j++) {
            var num = stepnum(cursor, proof);
            var newstep = makestep(num, results[j], 'Удаление конъюнкции', steps[i]);
            proof.splice(num, 0, newstep);
            updateproof(num, 1, proof);
            if (cursor) { cursor = cursor + 1 }
        }
    };
    showproof(proof);
    return true
}

function ae(p) {
    if (!symbolp(p) && p[0] == 'and') {
        return p.slice(1, p.length)
    }
    return empty()
}

// =====================================================================
// Введение дизъюнкции
// =====================================================================

function dooi() {
    document.getElementById('oi').style.display = '';
    document.getElementById('newoi').focus()
}

function addoi() {
    var steps = getcheckedpremises(proof);
    if (steps.length == 0) {
        alert('Не выбрано совместимых с правилом вывода шагов доказательства.');
        return false
    };
    dobackup();
    var exp = read(document.getElementById('newoi').value);
    if (exp === 'error') {
        alert('Синтаксическая ошибка');
        return false
    };
    document.getElementById('oi').style.display = 'none';
    for (var i = 0; i < steps.length; i++) {
        var result = oi(proof[steps[i]][2], exp);
        proof[proof.length] = makestep(proof.length, result, 'Введение дизъюнкции', steps[i]);
        result = oi(exp, proof[steps[i]][2]);
        proof[proof.length] = makestep(proof.length, result, 'Введение дизъюнкции', steps[i])
    };
    showproof(proof);
    return true
}

function oi(p, q) {
    return makedisjunction(p, q)
}

function unoi() {
    document.getElementById('oi').style.display = 'none'
}

// =====================================================================
// Удаление дизъюнкции
// =====================================================================

function dooe() {
    var steps = getcheckedpremises(proof);
    if (steps.length == 0) {
        alert('Не выбрано совместимых с правилом вывода шагов доказательства.');
        return false
    };
    dobackup();
    for (var i = 0; i < steps.length; i++) {
        if (proof[steps[i]][2][0] === 'or') {
            for (var j = 0; j < steps.length; j++) {
                if (!symbolp(proof[steps[j]][2]) &&
                    proof[steps[j]][2][0] === 'implication' &&
                    equalp(proof[steps[j]][2][1], proof[steps[i]][2][1])) {
                    for (var k = 0; k < steps.length; k++) {
                        if (!symbolp(proof[steps[k]][2]) &&
                            proof[steps[k]][2][0] == 'implication' &&
                            equalp(proof[steps[k]][2][1], proof[steps[i]][2][2]) &&
                            equalp(proof[steps[k]][2][2], proof[steps[j]][2][2]))
                            proof[proof.length] = makestep(proof.length, proof[steps[k]][2][2],
                                'Удаление дизъюнкции', steps[i], steps[j], steps[k])
                    }
                }
            }
        }
    };
    showproof(proof);
    return true
}

// =====================================================================
// Введение импликации
// =====================================================================

function doii() {
    if (prooflevel(proof) === 1) {
        alert('Не выбрано совместимых с правилом вывода шагов доказательства.');
        return false
    };
    dobackup();
    var start = getassumption(proof);
    if (start) {
        var result = makeimplication(proof[start][2], proof[proof.length - 1][2])
    };
    proof[proof.length] = makestep(proof.length, result, 'Введение импликации', start, proof.length - 1);
    showproof(proof);
    return true
}

function getassumption(proof) {
    var level = 0;
    for (var i = proof.length - 1; i > 0; i--) {
        if (proof[i][3] === 'Введение импликации') { level = level + 1 };
        if (proof[i][3] === 'Гипотеза') {
            if (level === 0) {
                return i
            } else {
                level = level - 1
            }
        }
    };
    return false
}

// =====================================================================
// Удаление импликации
// =====================================================================

function doie() {
    var steps = getcheckedpremises(proof);
    if (steps.length == 0) {
        alert('Не выбрано совместимых с правилом вывода шагов доказательства.');
        return false
    };
    dobackup();
    for (var i = 0; i < steps.length; i++) {
        for (var j = 0; j < steps.length; j++) {
            var result = mp(proof[steps[i]][2], proof[steps[j]][2]);
            if (result != false) {
                var num = stepnum(cursor, proof);
                var newstep = makestep(num, result, 'Удаление импликации', steps[i], steps[j]);
                proof.splice(num, 0, newstep);
                updateproof(num, 1, proof);
                if (cursor) { cursor = cursor + 1 }
            }
        }
    };
    showproof(proof);
    return true
}

function mp(p, q) {
    if (!symbolp(p) && p[0] == 'implication' && equalp(p[1], q)) {
        return p[2]
    } else {
        return false
    }
}

// =====================================================================
// Введение эквивалентности
// =====================================================================

function dobi() {
    var steps = getcheckedpremises(proof);
    if (steps.length == 0) {
        alert('Не выбрано совместимых с правилом вывода шагов доказательства.');
        return false
    };
    dobackup();
    for (var i = 0; i < steps.length; i++) {
        for (var j = 0; j < steps.length; j++) {
            var result = bi(proof[steps[i]][2], proof[steps[j]][2]);
            if (result != false) {
                var num = stepnum(cursor, proof);
                var newstep = makestep(num, result, 'Введение эквивалентности', steps[i], steps[j]);
                proof.splice(num, 0, newstep);
                updateproof(num, 1, proof);
                if (cursor) { cursor = cursor + 1 }
            }
        }
    };
    showproof(proof);
    return true
}

function bi(p, q) {
    if (!symbolp(p) && p[0] === 'implication' &&
        !symbolp(q) && q[0] === 'implication' &&
        equalp(p[1], q[2]) && equalp(p[2], q[1])) {
        return makeequivalence(p[1], p[2])
    };
    return false
}

// =====================================================================
// Удаление эквивалентности
// =====================================================================

function dobe() {
    var steps = getcheckedpremises(proof);
    if (steps.length == 0) {
        alert('No compatible rows selected.');
        return false
    };
    dobackup();
    for (var i = 0; i < steps.length; i++) {
        var results = be(proof[steps[i]][2]);
        for (var j = 0; j < results.length; j++) {
            proof[proof.length] = makestep(proof.length, results[j], 'Удаление эквивалентности', steps[i])
        }
    };
    showproof(proof);
    return true
}

function be(p) {
    if (!symbolp(p) && p[0] == 'equivalence') {
        return seq(makeimplication(p[1], p[2]), makeimplication(p[2], p[1]))
    };
    return empty()
}

// =====================================================================
// Вспомогательные функциии
// =====================================================================

function getcheckedstep(proof) {
    for (var i = 1; i < proof.length; i++) {
        if (document.getElementById(proof[i][1]).checked) {
            return i
        }
    };
    return false
}

function getcheckedsteps(proof) {
    var steps = seq();
    for (var i = 1; i < proof.length; i++) {
        if (document.getElementById(i).checked) {
            steps[steps.length] = i
        }
    };
    return steps
}

function getcheckedpremises(proof) {
    var assumptions = getassumptions(proof);
    var steps = seq();
    var num = stepnum(cursor, proof);
    for (var i = 1; i < num; i++) {
        if (document.getElementById(i).checked && compatible(i, assumptions)) {
            steps[steps.length] = i
        }
    };
    return steps
}

function getassumptions(proof) {
    var level = 0;
    var assumptions = seq();
    var num = stepnum(cursor, proof);
    for (var i = num - 1; i > 0; i--) {
        if (proof[i][3] === 'Введение импликации') { level = level + 1 };
        if (proof[i][3] === 'Гипотеза') {
            if (level === 0) {
                assumptions = adjoin(i, assumptions)
            };
            if (level > 0) { level = level - 1 }
        }
    };
    return assumptions
}

function compatible(item, assumptions) {
    var step = proof[item];
    if (step[3] === 'Гипотеза' && !findq(item, assumptions)) { return false };
    if (step[3] === 'Введение импликации') {
        assumptions = assumptions.slice(0);
        assumptions[assumptions.length] = step[4];
        return compatible(step[5], assumptions)
    };
    for (var j = 4; j < step.length; j++) {
        if (!compatible(step[j], assumptions)) { return false }
    };
    return true
}
