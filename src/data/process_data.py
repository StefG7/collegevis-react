import csv

process_job_data = False
process_all_maj = False
process_maj_min = False

counter = 0

def findMajor(all_major, major):
    for i in range(len(all_major)):
        if all_major[i][0] == major[0] and all_major[i][1] == major[1]:
            return i
        
    print("SOMETHING IS WRONG")
    print(major)
    return -1

if process_job_data:
    job_categories = {}
    categories_job = {}

    with open('raw_data/job_cat_list.csv') as job_data:
        reader = csv.reader(job_data)
        job_initial = True
        for row in reader:
            if (job_initial):
                job_initial = False
                continue

            job_categories[row[0]] = list(filter(lambda a : a!='', row[1:]))

    for k in job_categories.keys():
        for mc in job_categories[k]:
            if mc not in categories_job.keys():
                categories_job[mc] = set()
            
            categories_job[mc].add(k)

    for mc in categories_job.keys():
        categories_job[mc] = list(categories_job[mc])

    with open('job_minor_categorization.jsx', 'w+', encoding='UTF-8') as jobout:
        jobout.write("export const JOB_MINOR_CATEGORIZATION = ")
        jobout.write(str(job_categories))
        jobout.write("\n\nexport const MINOR_CATEGORIZATION_JOB = ")
        jobout.write(str(categories_job))

all_major = []
major_data = []

if process_all_maj or process_maj_min:
    with open('raw_data/all_major.csv') as majorraw:
        reader = csv.reader(majorraw)
        major_initial = True
        for row in reader:
            if (major_initial):
                major_initial = False
                continue
            major_info = [element.replace("Ã©", "é") for element in row]

            if not major_info in major_data:
                major_data.append(major_info)

    with open('all_major.jsx', 'w+', encoding='UTF-8') as majorawout:
        majorawout.write("export const ALL_MAJORS = ")
        majorawout.write(str(major_data))

all_major = [[m[0], m[2]] for m in major_data]

if process_maj_min:
    minor_categories = []
    maj_min_data = {} # major_id: [minor_categories]
    min_maj_data = {} # minor_categories: [major_ids]

    with open('raw_data/major_by_minor_category.csv') as majorraw:
        reader = csv.reader(majorraw)
        i = 0
        for row in reader:
            actual_row = row
            
            if (i == 1):
                minor_categories = actual_row

                for j in range(0, len(actual_row), 3):
                    min_maj_data[actual_row[j]] = set()

            elif (i > 1):
                for j in range(0, len(actual_row), 3):
                    if actual_row[j] == '':
                        if actual_row[j] != actual_row[j+1] != actual_row[j+2]:
                            print("WAIT!!! " + actual_row)
                        else:
                            continue

                    #print(actual_row)
                    #print([actual_row[j], actual_row[j+1], actual_row[j+2]])
                    major_i = findMajor(all_major, [actual_row[j+1], actual_row[j]])

                    if major_i == -1:
                        counter += 1
                        if counter == 1:
                            exit()

                    if major_i not in maj_min_data.keys():
                        maj_min_data[major_i] = set()
                    
                    maj_min_data[major_i].add(minor_categories[j])
                    min_maj_data[minor_categories[j]].add(major_i)

            i += 1

        for k in maj_min_data.keys():
            maj_min_data[k] = list(maj_min_data[k])

        for k in min_maj_data.keys():
            min_maj_data[k] = list(min_maj_data[k])

    with open('major_minor_categorization.jsx', 'w+') as majorawout:
        majorawout.write("export const MAJOR_MINOR_CATEGORIZATION = ")
        majorawout.write(str(maj_min_data))
        majorawout.write("\n\nexport const MINOR_CATEGORIZATION_MAJOR = ")
        majorawout.write(str(min_maj_data))
