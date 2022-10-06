# Write html sudoku table
html =""
print()
#loop trhough each tr
for i in range(9):

    html += (f'<tr id="r{i}">\n')

    # Loop through td
    for j in range(9):
        id = str(i) + str(j)
        html += (f'''    <td id="r{i}d{j}">
        <input type="text" maxlength="1" id="input{i}{j}">
    </td>
''')
    html += ("</tr>\n")
print(html)