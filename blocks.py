import collections
import fileinput

def main():
    d = collections.defaultdict(int)
    for i, line in enumerate(fileinput.input()):
        row = line.split(',')
        try:
            lng1 = '%.3f' % float(row[5])
            lat1 = '%.3f' % float(row[6])
            lng2 = '%.3f' % float(row[9])
            lat2 = '%.3f' % float(row[10])
            key = (lat1, lng1, lat2, lng2)
            d[key] += 1
        except Exception:
            pass
    for (lat1, lng1, lat2, lng2), count in d.iteritems():
        row = (lat1, lng1, lat2, lng2, count)
        if lat1 == '0.000' or lat2 == '0.000':
            continue
        print ','.join(map(str, row))

if __name__ == '__main__':
    main()
