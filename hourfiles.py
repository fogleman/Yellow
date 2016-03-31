import collections
import fileinput

def main():
    d = collections.defaultdict(lambda: [0] * 24)
    for i, line in enumerate(fileinput.input()):
        lat1, lng1, hour, count = line.strip().split(',')
        hour = int(hour)
        count = int(count)
        key = (lat1, lng1)
        d[key][hour] = count
    for (lat1, lng1), hours in d.iteritems():
        if max(hours) < 10:
            continue
        name = 'hours1/%.0f.%.0f.txt' % (float(lat1) * 1000, float(lng1) * -1000)
        line = ','.join(map(str, hours))
        with open(name, 'w') as fp:
            fp.write(line)
        print name, line
    print len(d)

if __name__ == '__main__':
    main()
