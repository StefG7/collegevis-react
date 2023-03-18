import csv

process_maj_min = True
process_all_maj = True

if process_maj_min:
    minor_categories = []
    maj_min_data = {} # major_id: [minor_categories]

    with open('raw_data/major_by_minor_category.csv') as majorraw:
        reader = csv.reader(majorraw)
        i = 0
        for row in reader:
            actual_row = row[:-2]
            
            if (i == 1):
                minor_categories = actual_row
            elif (i > 1):
                for j in range(0, len(actual_row), 3):
                    if actual_row[j] == '':
                        if actual_row[j] != actual_row[j+1] != actual_row[j+2]:
                            print("WAIT!!! " + actual_row)
                        else:
                            continue

                    if int(actual_row[j+2]) + 1 not in maj_min_data.keys():
                        maj_min_data[int(actual_row[j+2]) + 1] = set()
                    
                    maj_min_data[int(actual_row[j+2]) + 1].add(minor_categories[j])

            i += 1

        for k in maj_min_data.keys():
            maj_min_data[k] = list(maj_min_data[k])

    with open('major_minor_categorization.jsx', 'w+') as majorawout:
        majorawout.write("export const MAJOR_MINOR_CATEGORIZATION = ")
        majorawout.write(str(maj_min_data))

if process_all_maj:
    major_data = []

    with open('raw_data/all_major.csv') as majorraw:
        reader = csv.reader(majorraw)
        major_initial = True
        for row in reader:
            if (major_initial):
                major_initial = False
                continue
            major_data.append([element.replace("Ã©", "é") for element in row])

    with open('all_major.jsx', 'w+', encoding='UTF-8') as majorawout:
        majorawout.write("export const ALL_MAJORS = ")
        majorawout.write(str(major_data))
