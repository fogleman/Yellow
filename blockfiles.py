import collections
import fileinput

def main():
    d = collections.defaultdict(list)
    for i, line in enumerate(fileinput.input()):
        lat1, lng1, lat2, lng2, count = line.strip().split(',')
        count = int(count)
        if count < 3:
            continue
        key = (lat1, lng1)
        value = (lat2, lng2, count)
        d[key].append(value)
    for (lat1, lng1), blocks in d.iteritems():
        name = 'blocks2/%.0f.%.0f.txt' % (float(lat1) * 1000, float(lng1) * -1000)
        blocks.sort(key=lambda x: x[2], reverse=True)
        rows = []
        for (lat2, lng2, count) in blocks:
            row = '%s,%s,%d' % (lat2, lng2, count)
            rows.append(row)
        with open(name, 'w') as fp:
            fp.write('\n'.join(rows))
        print name, len(blocks)
    print len(d)

if __name__ == '__main__':
    main()
