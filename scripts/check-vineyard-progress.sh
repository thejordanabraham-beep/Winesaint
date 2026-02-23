#!/bin/bash

echo "==================================================================="
echo "GERMAN VINEYARD GUIDE GENERATION PROGRESS"
echo "==================================================================="
echo ""

# Count completed guides
rheingau_count=$(ls -1 /Users/jordanabraham/wine-reviews/guides/*-vineyard-guide.md 2>/dev/null | grep -E "(baikenkopf|berg-|domprasenz|doosberg|erbacher|gehrn|grafenberg|greiffenberg|hasensprung|hassel|hohenrain|holle|hollenberg|im-landberg|im-rothenberg|jesuitengarten|jungfer|kapellenberg|kirchenpfad|kirchenstuck-im-stein|klaus|klauserweg|konigin|langenberg|lenchen|marcobrunn|mauerchen|morschberg|nonnberg|nussbrunnen|pfaffenwies|rauenthaler|reichestal|rodchen|rosengarten|rothenberg|rudesheimer|sankt-nikolaus|schlenzenberg|schloss-johannisberg|schlossberg|schonhell|seligmacher|siegelsberg|steinberg|unterer|walkenberg|weiss-erd|wisselbrunnen)" | wc -l)

pfalz_count=$(ls -1 /Users/jordanabraham/wine-reviews/guides/*-vineyard-guide.md 2>/dev/null | grep -E "(annaberg|burgergarten|felsenberg|freundstuck|gaisbohl|grainhubel|guldenwingert|herrenberg|heydenreich|hohenmorgen|holle-unterer|idig|im-grossen|im-sonnenschein|kalkberg|kalkofen|kalmit|kammerberg|kastanienbusch|kieselberg|kirchberg|kirchenstuck|kirschgarten|kostert|kreuzberg|langenmorgen|mandelberg|mandelpfad|meerspinne|michelsberg|munzberg|odinstal|olberg-hart|pechstein|philippsbrunnen|radling|reiterpfad|rosenkranz|sankt-paul|saumagen|schawer|schild|schwarzer-herrgott|sonnenberg|steinbuckel|ungeheuer|vogelsang|weilberg)" | wc -l)

rheinhessen_count=$(ls -1 /Users/jordanabraham/wine-reviews/guides/*-vineyard-guide.md 2>/dev/null | grep -E "(aulerde|brudersberg|brunnenhauschen|burgel|burgweg|falkenberg|fenchelberg|frauenberg|geiersberg|glock|heerkretz|hipping|hollberg|hollenbrand|honigberg|horn|hundertgulden|kirchspiel|kloppberg|kranzberg|kreuz|leckerberg|liebfrauenstift|morstein|oberer-hubacker|olberg|orbel|pares|paterberg|pettenthal|sacktrager|scharlachberg|schloss-westerhaus|steinacker|tafelstein|zehnmorgen|zellerweg)" | wc -l)

total_count=$(ls -1 /Users/jordanabraham/wine-reviews/guides/*-vineyard-guide.md 2>/dev/null | wc -l)

echo "Rheingau: $rheingau_count / 54"
echo "Pfalz: $pfalz_count / 55"
echo "Rheinhessen: $rheinhessen_count / 41"
echo ""
echo "TOTAL: $total_count / 150"
echo ""

# Check if generation is still running
if pgrep -f "generate-german-vineyard-guides" > /dev/null; then
    echo "Status: RUNNING ✓"
    echo ""
    echo "Latest activity:"
    tail -30 /private/tmp/claude/-Users-jordanabraham/tasks/b0af26f.output 2>/dev/null | tail -20
else
    echo "Status: COMPLETED or NOT RUNNING"
fi

echo ""
echo "==================================================================="
