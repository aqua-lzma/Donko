import json
import spacy

nlp = spacy.load("en")

with open("corpus.json") as f:
    j = json.load(f)
    cured = []
    for index, line in enumerate(j):
        nline = []
        prev = " "
        for token in nlp(line):
            nline.append([token.orth_, token.pos_, prev])
            prev = token.whitespace_
        cured.append(nline)
        if index % int(len(j) / 100) == 0:
            print("{:.0%} {} / {}\n{}".format((index / len(j)) * 100, index, len(j), nline))
    with open("cleaned.json", "w") as f2:
        json.dump(cured, f2)
