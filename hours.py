import collections
import fileinput

def main():
    d = collections.defaultdict(int)
    for i, line in enumerate(fileinput.input()):
        row = line.split(',')
        try:
            hour = row[1][11:13]
            lng1 = '%.3f' % float(row[5])
            lat1 = '%.3f' % float(row[6])
            key = (lat1, lng1, hour)
            d[key] += 1
        except Exception:
            pass
    for (lat1, lng1, hour), count in d.iteritems():
        row = (lat1, lng1, hour, count)
        if lat1 == '0.000':
            continue
        print ','.join(map(str, row))

if __name__ == '__main__':
    main()
