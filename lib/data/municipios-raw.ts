/* Municipios de España (del CSV de localidades del usuario).
   Formato por línea: comunidad;provincia;municipio;población */
const raw = `
Andalucía;Almería;Abla;1504
Andalucía;Almería;Abrucena;1341
Andalucía;Almería;Adra;24373
Andalucía;Almería;Albánchez;815
Andalucía;Almería;Alboloduy;674
Andalucía;Almería;Albox;11178
Andalucía;Almería;Alcolea;908
Andalucía;Almería;Alcóntar;603
Andalucía;Almería;Alcudia de Monteagud;141
Andalucía;Almería;Alhabia;724
Andalucía;Almería;Alhama de Almería;3779
Andalucía;Almería;Alicún;254
Andalucía;Almería;Almería;188810
Andalucía;Almería;Almócita;167
Andalucía;Almería;Alsodux;155
Andalucía;Almería;Antas;3403
Andalucía;Almería;Arboleas;4527
Andalucía;Almería;Armuña de Almanzora;335
Andalucía;Almería;Bacares;280
Andalucía;Almería;Bayárcal;306
Andalucía;Almería;Bayarque;230
Andalucía;Almería;Bédar;1014
Andalucía;Almería;Beires;126
Andalucía;Almería;Benahadux;3940
Andalucía;Almería;Benitagla;88
Andalucía;Almería;Benizalón;286
Andalucía;Almería;Bentarique;272
Andalucía;Almería;Berja;15035
Andalucía;Almería;Canjáyar;1506
Andalucía;Almería;Cantoria;4016
Andalucía;Almería;Carboneras;7964
Andalucía;Almería;Castro de Filabres;161
Andalucía;Almería;Chercos;295
Andalucía;Almería;Chirivel;1854
Andalucía;Almería;Cóbdar;188
Andalucía;Almería;Cuevas del Almanzora;13025
Andalucía;Almería;Dalías;3958
Andalucía;Almería;Ejido (El);84227
Andalucía;Almería;Enix;484
Andalucía;Almería;Felix;654
Andalucía;Almería;Fiñana;2424
Andalucía;Almería;Fines;2378
Andalucía;Almería;Fondón;991
Andalucía;Almería;Gádor;3244
Andalucía;Almería;Gallardos (Los);3752
Andalucía;Almería;Garrucha;8626
Andalucía;Almería;Gérgal;1107
Andalucía;Almería;Huécija;539
Andalucía;Almería;Huércal-Overa;17645
Andalucía;Almería;Huércal de Almería;14937
Andalucía;Almería;Illar;436
Andalucía;Almería;Instinción;493
Andalucía;Almería;Laroya;149
Andalucía;Almería;Láujar de Andarax;1796
Andalucía;Almería;Líjar;507
Andalucía;Almería;Lubrín;1751
Andalucía;Almería;Lucainena de las Torres;690
Andalucía;Almería;Lúcar;872
Andalucía;Almería;Macael;6168
Andalucía;Almería;María;1464
Andalucía;Almería;Mojácar;7581
Andalucía;Almería;Mojonera (La);8301
Andalucía;Almería;Nacimiento;482
Andalucía;Almería;Níjar;26516
Andalucía;Almería;Ohanes;776
Andalucía;Almería;Olula de Castro;207
Andalucía;Almería;Olula del Río;6699
Andalucía;Almería;Oria;2898
Andalucía;Almería;Padules;491
Andalucía;Almería;Partaloa;872
Andalucía;Almería;Paterna del Río;448
Andalucía;Almería;Pechina;3690
Andalucía;Almería;Pulpí;8182
Andalucía;Almería;Purchena;1736
Andalucía;Almería;Rágol;361
Andalucía;Almería;Rioja;1389
Andalucía;Almería;Roquetas de Mar;82665
Andalucía;Almería;Santa Cruz de Marchena;232
Andalucía;Almería;Santa Fe de Mondújar;485
Andalucía;Almería;Senés;354
Andalucía;Almería;Serón;2385
Andalucía;Almería;Sierro;451
Andalucía;Almería;Somontín;529
Andalucía;Almería;Sorbas;2854
Andalucía;Almería;Suflí;279
Andalucía;Almería;Tabernas;3627
Andalucía;Almería;Taberno;1131
Andalucía;Almería;Tahal;446
Andalucía;Almería;Terque;457
Andalucía;Almería;Tíjola;3985
Andalucía;Almería;Tres Villas (Las);656
Andalucía;Almería;Turre;3626
Andalucía;Almería;Turrillas;224
Andalucía;Almería;Uleila del Campo;1015
Andalucía;Almería;Urrácal;354
Andalucía;Almería;Velefique;300
Andalucía;Almería;Vélez-Blanco;2259
Andalucía;Almería;Vélez-Rubio;7150
Andalucía;Almería;Vera;13985
Andalucía;Almería;Viator;4860
Andalucía;Almería;Vícar;22853
Andalucía;Almería;Zurgena;3066
Andalucía;Cádiz;Alcalá de los Gazules;5619
Andalucía;Cádiz;Alcalá del Valle;5300
Andalucía;Cádiz;Algar;1544
Andalucía;Cádiz;Algeciras;116209
Andalucía;Cádiz;Algodonales;5732
Andalucía;Cádiz;Arcos de la Frontera;31210
Andalucía;Cádiz;Barbate;22912
Andalucía;Cádiz;Barrios (Los);22311
Andalucía;Cádiz;Benalup-Casas Viejas;7151
Andalucía;Cádiz;Benaocaz;731
Andalucía;Cádiz;Bornos;8134
Andalucía;Cádiz;Bosque (El);2102
Andalucía;Cádiz;Cádiz;126766
Andalucía;Cádiz;Castellar de la Frontera;3161
Andalucía;Cádiz;Chiclana de la Frontera;77293
Andalucía;Cádiz;Chipiona;18583
Andalucía;Cádiz;Conil de la Frontera;20984
Andalucía;Cádiz;Espera;4003
Andalucía;Cádiz;Gastor (El);1859
Andalucía;Cádiz;Grazalema;2205
Andalucía;Cádiz;Jerez de la Frontera;207532
Andalucía;Cádiz;Jimena de la Frontera;10431
Andalucía;Cádiz;Línea de la Concepción (La);64595
Andalucía;Cádiz;Medina-Sidonia;11683
Andalucía;Cádiz;Olvera;8589
Andalucía;Cádiz;Paterna de Rivera;5610
Andalucía;Cádiz;Prado del Rey;5956
Andalucía;Cádiz;Puerto de Santa María (El);87696
Andalucía;Cádiz;Puerto Real;40183
Andalucía;Cádiz;Puerto Serrano;7116
Andalucía;Cádiz;Rota;28516
Andalucía;Cádiz;San Fernando;96366
Andalucía;Cádiz;San José del Valle;4403
Andalucía;Cádiz;San Roque;29249
Andalucía;Cádiz;Sanlúcar de Barrameda;65805
Andalucía;Cádiz;Setenil de las Bodegas;2977
Andalucía;Cádiz;Tarifa;17793
Andalucía;Cádiz;Torre Alháquime;849
Andalucía;Cádiz;Trebujena;6966
Andalucía;Cádiz;Ubrique;16979
Andalucía;Cádiz;Vejer de la Frontera;12973
Andalucía;Cádiz;Villaluenga del Rosario;479
Andalucía;Cádiz;Villamartín;12526
Andalucía;Cádiz;Zahara;1513
Andalucía;Córdoba;Adamuz;4419
Andalucía;Córdoba;Aguilar de la Frontera;13746
Andalucía;Córdoba;Alcaracejos;1528
Andalucía;Córdoba;Almedinilla;2522
Andalucía;Córdoba;Almodóvar del Río;7839
Andalucía;Córdoba;Añora;1534
Andalucía;Córdoba;Baena;20915
Andalucía;Córdoba;Belalcázar;3466
Andalucía;Córdoba;Belmez;3246
Andalucía;Córdoba;Benamejí;5146
Andalucía;Córdoba;Blázquez (Los);738
Andalucía;Córdoba;Bujalance;7889
Andalucía;Córdoba;Cabra;21352
Andalucía;Córdoba;Cañete de las Torres;3144
Andalucía;Córdoba;Carcabuey;2738
Andalucía;Córdoba;Cardeña;1695
Andalucía;Córdoba;Carlota (La);13182
Andalucía;Córdoba;Carpio (El);4605
Andalucía;Córdoba;Castro del Río;8114
Andalucía;Córdoba;Conquista;484
Andalucía;Córdoba;Córdoba;328428
Andalucía;Córdoba;Doña Mencía;5044
Andalucía;Córdoba;Dos Torres;2570
Andalucía;Córdoba;Encinas Reales;2414
Andalucía;Córdoba;Espejo;3649
Andalucía;Córdoba;Espiel;2481
Andalucía;Córdoba;Fernán-Núñez;9701
Andalucía;Córdoba;Fuente-Tójar;780
Andalucía;Córdoba;Fuente la Lancha;375
Andalucía;Córdoba;Fuente Obejuna;5269
Andalucía;Córdoba;Fuente Palmera;10788
Andalucía;Córdoba;Granjuela (La);508
Andalucía;Córdoba;Guadalcázar;1519
Andalucía;Córdoba;Guijo (El);413
Andalucía;Córdoba;Hinojosa del Duque;7407
Andalucía;Córdoba;Hornachuelos;4684
Andalucía;Córdoba;Iznájar;4740
Andalucía;Córdoba;Lucena;42248
Andalucía;Córdoba;Luque;3273
Andalucía;Córdoba;Montalbán de Córdoba;4591
Andalucía;Córdoba;Montemayor;4073
Andalucía;Córdoba;Montilla;23840
Andalucía;Córdoba;Montoro;9917
Andalucía;Córdoba;Monturque;2021
Andalucía;Córdoba;Moriles;3966
Andalucía;Córdoba;Nueva Carteya;5679
Andalucía;Córdoba;Obejo;1872
Andalucía;Córdoba;Palenciana;1591
Andalucía;Córdoba;Palma del Río;21588
Andalucía;Córdoba;Pedro Abad;2980
Andalucía;Córdoba;Pedroche;1670
Andalucía;Córdoba;Peñarroya-Pueblonuevo;11883
Andalucía;Córdoba;Posadas;7558
Andalucía;Córdoba;Pozoblanco;17669
Andalucía;Córdoba;Priego de Córdoba;23513
Andalucía;Córdoba;Puente Genil;30033
Andalucía;Córdoba;Rambla (La);7601
Andalucía;Córdoba;Rute;10559
Andalucía;Córdoba;San Sebastián de los Ballesteros;829
Andalucía;Córdoba;Santa Eufemia;959
Andalucía;Córdoba;Santaella;6090
Andalucía;Córdoba;Torrecampo;1300
Andalucía;Córdoba;Valenzuela;1313
Andalucía;Córdoba;Valsequillo;405
Andalucía;Córdoba;Victoria (La);2197
Andalucía;Córdoba;Villa del Río;7425
Andalucía;Córdoba;Villafranca de Córdoba;4552
Andalucía;Córdoba;Villaharta;743
Andalucía;Córdoba;Villanueva de Córdoba;9663
Andalucía;Córdoba;Villanueva del Duque;1637
Andalucía;Córdoba;Villanueva del Rey;1204
Andalucía;Córdoba;Villaralto;1332
Andalucía;Córdoba;Villaviciosa de Córdoba;3558
Andalucía;Córdoba;Viso (El);2810
Andalucía;Córdoba;Zuheros;784
Andalucía;Granada;Agrón;358
Andalucía;Granada;Alamedilla;721
Andalucía;Granada;Albolote;17089
Andalucía;Granada;Albondón;871
Andalucía;Granada;Albuñán;436
Andalucía;Granada;Albuñol;6704
Andalucía;Granada;Albuñuelas;1015
Andalucía;Granada;Aldeire;707
Andalucía;Granada;Alfacar;5401
Andalucía;Granada;Algarinejo;3705
Andalucía;Granada;Alhama de Granada;6062
Andalucía;Granada;Alhendín;6298
Andalucía;Granada;Alicún de Ortega;526
Andalucía;Granada;Almegíjar;392
Andalucía;Granada;Almuñécar;27696
Andalucía;Granada;Alpujarra de la Sierra;1153
Andalucía;Granada;Alquife;718
Andalucía;Granada;Arenas del Rey;2071
Andalucía;Granada;Armilla;21380
Andalucía;Granada;Atarfe;15399
Andalucía;Granada;Baza;23359
Andalucía;Granada;Beas de Granada;1050
Andalucía;Granada;Beas de Guadix;378
Andalucía;Granada;Benalúa;3326
Andalucía;Granada;Benalúa de las Villas;1434
Andalucía;Granada;Benamaurel;2417
Andalucía;Granada;Bérchules;820
Andalucía;Granada;Bubión;358
Andalucía;Granada;Busquístar;311
Andalucía;Granada;Cacín;633
Andalucía;Granada;Cádiar;1634
Andalucía;Granada;Cájar;4596
Andalucía;Granada;Calahorra (La);800
Andalucía;Granada;Calicasas;564
Andalucía;Granada;Campotéjar;1420
Andalucía;Granada;Cáñar;429
Andalucía;Granada;Caniles;4955
Andalucía;Granada;Capileira;554
Andalucía;Granada;Carataunas;192
Andalucía;Granada;Cástaras;268
Andalucía;Granada;Castilléjar;1584
Andalucía;Granada;Castril;2465
Andalucía;Granada;Cenes de la Vega;6501
Andalucía;Granada;Chauchina;4778
Andalucía;Granada;Chimeneas;1507
Andalucía;Granada;Churriana de la Vega;12001
Andalucía;Granada;Cijuela;2857
Andalucía;Granada;Cogollos de Guadix;715
Andalucía;Granada;Cogollos de la Vega;2083
Andalucía;Granada;Colomera;1568
Andalucía;Granada;Cortes de Baza;2266
Andalucía;Granada;Cortes y Graena;1037
Andalucía;Granada;Cuevas del Campo;2077
Andalucía;Granada;Cúllar;4766
Andalucía;Granada;Cúllar Vega;6658
Andalucía;Granada;Darro;1468
Andalucía;Granada;Dehesas de Guadix;504
Andalucía;Granada;Deifontes;2530
Andalucía;Granada;Diezma;816
Andalucía;Granada;Dílar;1728
Andalucía;Granada;Dólar;611
Andalucía;Granada;Dúdar;335
Andalucía;Granada;Dúrcal;7264
Andalucía;Granada;Escúzar;830
Andalucía;Granada;Ferreira;342
Andalucía;Granada;Fonelas;1118
Andalucía;Granada;Freila;1109
Andalucía;Granada;Fuente Vaqueros;4395
Andalucía;Granada;Gabias (Las);16369
Andalucía;Granada;Galera;1106
Andalucía;Granada;Gobernador;285
Andalucía;Granada;Gójar;5206
Andalucía;Granada;Gor;920
Andalucía;Granada;Gorafe;489
Andalucía;Granada;Granada;234325
Andalucía;Granada;Guadahortuna;2057
Andalucía;Granada;Guadix;20395
Andalucía;Granada;Guajares (Los);1243
Andalucía;Granada;Gualchos;4368
Andalucía;Granada;Güejar Sierra;2967
Andalucía;Granada;Güevéjar;2400
Andalucía;Granada;Huélago;391
Andalucía;Granada;Huéneja;1201
Andalucía;Granada;Huéscar;8232
Andalucía;Granada;Huétor de Santillán;1824
Andalucía;Granada;Huétor Tájar;9953
Andalucía;Granada;Huétor Vega;11324
Andalucía;Granada;Illora;10440
Andalucía;Granada;Itrabo;1140
Andalucía;Granada;Iznalloz;7065
Andalucía;Granada;Jayena;1225
Andalucía;Granada;Jerez del Marquesado;1109
Andalucía;Granada;Jete;892
Andalucía;Granada;Jun;3241
Andalucía;Granada;Juviles;176
Andalucía;Granada;Láchar;3093
Andalucía;Granada;Lanjarón;3897
Andalucía;Granada;Lanteira;567
Andalucía;Granada;Lecrín;2322
Andalucía;Granada;Lentegí;333
Andalucía;Granada;Lobras;131
Andalucía;Granada;Loja;21574
Andalucía;Granada;Lugros;367
Andalucía;Granada;Lújar;468
Andalucía;Granada;Malahá (La);1812
Andalucía;Granada;Maracena;20815
Andalucía;Granada;Marchal;402
Andalucía;Granada;Moclín;4268
Andalucía;Granada;Molvízar;3273
Andalucía;Granada;Monachil;6967
Andalucía;Granada;Montefrío;6282
Andalucía;Granada;Montejícar;2481
Andalucía;Granada;Montillana;1304
Andalucía;Granada;Moraleda de Zafayona;3136
Andalucía;Granada;Morelábor;774
Andalucía;Granada;Motril;60279
Andalucía;Granada;Murtas;682
Andalucía;Granada;Nevada;1174
Andalucía;Granada;Nigüelas;1100
Andalucía;Granada;Nívar;868
Andalucía;Granada;Ogíjares;13119
Andalucía;Granada;Orce;1333
Andalucía;Granada;Órgiva;5659
Andalucía;Granada;Otívar;1150
Andalucía;Granada;Otura;6423
Andalucía;Granada;Padul;8440
Andalucía;Granada;Pampaneira;298
Andalucía;Granada;Pedro Martínez;1158
Andalucía;Granada;Peligros;10910
Andalucía;Granada;Peza (La);1366
Andalucía;Granada;Píñar;1306
Andalucía;Granada;Pinar (El);1039
Andalucía;Granada;Pinos Genil;1262
Andalucía;Granada;Pinos Puente;13515
Andalucía;Granada;Polícar;202
Andalucía;Granada;Polopos;1821
Andalucía;Granada;Pórtugos;408
Andalucía;Granada;Puebla de Don Fadrique;2517
Andalucía;Granada;Pulianas;5140
Andalucía;Granada;Purullena;2278
Andalucía;Granada;Quéntar;1065
Andalucía;Granada;Rubite;432
Andalucía;Granada;Salar;2849
Andalucía;Granada;Salobreña;12747
Andalucía;Granada;Santa Cruz del Comercio;596
Andalucía;Granada;Santa Fe;15430
Andalucía;Granada;Soportújar;242
Andalucía;Granada;Sorvilán;625
Andalucía;Granada;Taha (La);685
Andalucía;Granada;Torre-Cardela;970
Andalucía;Granada;Torvizcón;784
Andalucía;Granada;Trevélez;842
Andalucía;Granada;Turón;301
Andalucía;Granada;Ugíjar;2569
Andalucía;Granada;Valle (El);1143
Andalucía;Granada;Valle del Zalabí;2297
Andalucía;Granada;Válor;726
Andalucía;Granada;Vegas del Genil;8587
Andalucía;Granada;Vélez de Benaudalla;2968
Andalucía;Granada;Ventas de Huelma;722
Andalucía;Granada;Villamena;1028
Andalucía;Granada;Villanueva de las Torres;733
Andalucía;Granada;Villanueva Mesía;2173
Andalucía;Granada;Víznar;865
Andalucía;Granada;Zafarraya;2112
Andalucía;Granada;Zagra;968
Andalucía;Granada;Zubia (La);17803
Andalucía;Granada;Zújar;2997
Andalucía;Huelva;Alájar;808
Andalucía;Huelva;Aljaraque;17960
Andalucía;Huelva;Almendro (El);867
Andalucía;Huelva;Almonaster la Real;1848
Andalucía;Huelva;Almonte;21782
Andalucía;Huelva;Alosno;4381
Andalucía;Huelva;Aracena;7612
Andalucía;Huelva;Aroche;3113
Andalucía;Huelva;Arroyomolinos de León;1040
Andalucía;Huelva;Ayamonte;20334
Andalucía;Huelva;Beas;4293
Andalucía;Huelva;Berrocal;375
Andalucía;Huelva;Bollullos Par del Condado;13891
Andalucía;Huelva;Bonares;6015
Andalucía;Huelva;Cabezas Rubias;865
Andalucía;Huelva;Cala;1327
Andalucía;Huelva;Calañas;4285
Andalucía;Huelva;Campillo (El);2220
Andalucía;Huelva;Campofrío;808
Andalucía;Huelva;Cañaveral de León;428
Andalucía;Huelva;Cartaya;17905
Andalucía;Huelva;Castaño del Robledo;224
Andalucía;Huelva;Cerro de Andévalo (El);2479
Andalucía;Huelva;Chucena;2124
Andalucía;Huelva;Corteconcepción;607
Andalucía;Huelva;Cortegana;4965
Andalucía;Huelva;Cortelazor;313
Andalucía;Huelva;Cumbres de Enmedio;52
Andalucía;Huelva;Cumbres de San Bartolomé;463
Andalucía;Huelva;Cumbres Mayores;1970
Andalucía;Huelva;Encinasola;1596
Andalucía;Huelva;Escacena del Campo;2075
Andalucía;Huelva;Fuenteheridos;632
Andalucía;Huelva;Galaroza;1618
Andalucía;Huelva;Gibraleón;12258
Andalucía;Huelva;Granada de Río-Tinto (La);211
Andalucía;Huelva;Granado (El);573
Andalucía;Huelva;Higuera de la Sierra;1437
Andalucía;Huelva;Hinojales;326
Andalucía;Huelva;Hinojos;3890
Andalucía;Huelva;Huelva;148806
Andalucía;Huelva;Isla Cristina;21324
Andalucía;Huelva;Jabugo;2396
Andalucía;Huelva;Lepe;25886
Andalucía;Huelva;Linares de la Sierra;299
Andalucía;Huelva;Lucena del Puerto;2759
Andalucía;Huelva;Manzanilla;2341
Andalucía;Huelva;Marines (Los);358
Andalucía;Huelva;Minas de Riotinto;4221
Andalucía;Huelva;Moguer;19569
Andalucía;Huelva;Nava (La);321
Andalucía;Huelva;Nerva;6000
Andalucía;Huelva;Niebla;4183
Andalucía;Huelva;Palma del Condado (La);10404
Andalucía;Huelva;Palos de la Frontera;9043
Andalucía;Huelva;Paterna del Campo;3784
Andalucía;Huelva;Paymogo;1318
Andalucía;Huelva;Puebla de Guzmán;3098
Andalucía;Huelva;Puerto Moral;272
Andalucía;Huelva;Punta Umbría;14708
Andalucía;Huelva;Rociana del Condado;7317
Andalucía;Huelva;Rosal de la Frontera;1879
Andalucía;Huelva;San Bartolomé de la Torre;3468
Andalucía;Huelva;San Juan del Puerto;8049
Andalucía;Huelva;San Silvestre de Guzmán;747
Andalucía;Huelva;Sanlúcar de Guadiana;367
Andalucía;Huelva;Santa Ana la Real;482
Andalucía;Huelva;Santa Bárbara de Casa;1160
Andalucía;Huelva;Santa Olalla del Cala;2187
Andalucía;Huelva;Trigueros;7584
Andalucía;Huelva;Valdelarco;255
Andalucía;Huelva;Valverde del Camino;12780
Andalucía;Huelva;Villablanca;2793
Andalucía;Huelva;Villalba del Alcor;3510
Andalucía;Huelva;Villanueva de las Cruces;415
Andalucía;Huelva;Villanueva de los Castillejos;2812
Andalucía;Huelva;Villarrasa;2151
Andalucía;Huelva;Zalamea la Real;3414
Andalucía;Huelva;Zufre;973
Andalucía;Jaén;Albanchez de Mágina;1228
Andalucía;Jaén;Alcalá la Real;22783
Andalucía;Jaén;Alcaudete;11135
Andalucía;Jaén;Aldeaquemada;545
Andalucía;Jaén;Andújar;39111
Andalucía;Jaén;Arjona;5822
Andalucía;Jaén;Arjonilla;3851
Andalucía;Jaén;Arquillos;1952
Andalucía;Jaén;Arroyo del Ojanco;2483
Andalucía;Jaén;Baeza;16253
Andalucía;Jaén;Bailén;18785
Andalucía;Jaén;Baños de la Encina;2716
Andalucía;Jaén;Beas de Segura;5591
Andalucía;Jaén;Bedmar y Garcíez;3127
Andalucía;Jaén;Begíjar;3165
Andalucía;Jaén;Bélmez de la Moraleda;1833
Andalucía;Jaén;Benatae;545
Andalucía;Jaén;Cabra del Santo Cristo;2101
Andalucía;Jaén;Cambil;2968
Andalucía;Jaén;Campillo de Arenas;2094
Andalucía;Jaén;Canena;2083
Andalucía;Jaén;Carboneros;663
Andalucía;Jaén;Cárcheles;1505
Andalucía;Jaén;Carolina (La);15880
Andalucía;Jaén;Castellar;3601
Andalucía;Jaén;Castillo de Locubín;4732
Andalucía;Jaén;Cazalilla;889
Andalucía;Jaén;Cazorla;8133
Andalucía;Jaén;Chiclana de Segura;1230
Andalucía;Jaén;Chilluévar;1594
Andalucía;Jaén;Escañuela;970
Andalucía;Jaén;Espelúy;758
Andalucía;Jaén;Frailes;1788
Andalucía;Jaén;Fuensanta de Martos;3286
Andalucía;Jaén;Fuerte del Rey;1354
Andalucía;Jaén;Génave;629
Andalucía;Jaén;Guardia de Jaén (La);4061
Andalucía;Jaén;Guarromán;2936
Andalucía;Jaén;Higuera de Calatrava;659
Andalucía;Jaén;Hinojares;409
Andalucía;Jaén;Hornos;684
Andalucía;Jaén;Huelma;6231
Andalucía;Jaén;Huesa;2677
Andalucía;Jaén;Ibros;3122
Andalucía;Jaén;Iruela (La);1985
Andalucía;Jaén;Iznatoraf;1107
Andalucía;Jaén;Jabalquinto;2351
Andalucía;Jaén;Jaén;116557
Andalucía;Jaén;Jamilena;3485
Andalucía;Jaén;Jimena;1464
Andalucía;Jaén;Jódar;12157
Andalucía;Jaén;Lahiguera;1886
Andalucía;Jaén;Larva;478
Andalucía;Jaén;Linares;61338
Andalucía;Jaén;Lopera;4008
Andalucía;Jaén;Lupión;981
Andalucía;Jaén;Mancha Real;10972
Andalucía;Jaén;Marmolejo;7595
Andalucía;Jaén;Martos;24655
Andalucía;Jaén;Mengíbar;9572
Andalucía;Jaén;Montizón;1904
Andalucía;Jaén;Navas de San Juan;5030
Andalucía;Jaén;Noalejo;2023
Andalucía;Jaén;Orcera;2070
Andalucía;Jaén;Peal de Becerro;5574
Andalucía;Jaén;Pegalajar;3141
Andalucía;Jaén;Porcuna;6868
Andalucía;Jaén;Pozo Alcón;5396
Andalucía;Jaén;Puente de Génave;2222
Andalucía;Jaén;Puerta de Segura (La);2638
Andalucía;Jaén;Quesada;5916
Andalucía;Jaén;Rus;3801
Andalucía;Jaén;Sabiote;4291
Andalucía;Jaén;Santa Elena;1032
Andalucía;Jaén;Santiago-Pontones;3758
Andalucía;Jaén;Santiago de Calatrava;860
Andalucía;Jaén;Santisteban del Puerto;4860
Andalucía;Jaén;Santo Tomé;2460
Andalucía;Jaén;Segura de la Sierra;2054
Andalucía;Jaén;Siles;2438
Andalucía;Jaén;Sorihuela del Guadalimar;1333
Andalucía;Jaén;Torre del Campo;14627
Andalucía;Jaén;Torreblascopedro;2801
Andalucía;Jaén;Torredonjimeno;14181
Andalucía;Jaén;Torreperogil;7225
Andalucía;Jaén;Torres;1663
Andalucía;Jaén;Torres de Albánchez;1001
Andalucía;Jaén;Úbeda;35649
Andalucía;Jaén;Valdepeñas de Jaén;4198
Andalucía;Jaén;Vilches;4938
Andalucía;Jaén;Villacarrillo;11294
Andalucía;Jaén;Villanueva de la Reina;3435
Andalucía;Jaén;Villanueva del Arzobispo;8714
Andalucía;Jaén;Villardompardo;1132
Andalucía;Jaén;Villares (Los);5783
Andalucía;Jaén;Villarrodrigo;474
Andalucía;Jaén;Villatorres;4445
Andalucía;Málaga;Alameda;5481
Andalucía;Málaga;Alcaucín;2576
Andalucía;Málaga;Alfarnate;1348
Andalucía;Málaga;Alfarnatejo;538
Andalucía;Málaga;Algarrobo;6219
Andalucía;Málaga;Algatocín;909
Andalucía;Málaga;Alhaurín de la Torre;35114
Andalucía;Málaga;Alhaurín el Grande;23319
Andalucía;Málaga;Almáchar;1888
Andalucía;Málaga;Almargen;2154
Andalucía;Málaga;Almogía;4298
Andalucía;Málaga;Álora;13395
Andalucía;Málaga;Alozaina;2242
Andalucía;Málaga;Alpandeire;271
Andalucía;Málaga;Antequera;45168
Andalucía;Málaga;Árchez;440
Andalucía;Málaga;Archidona;8858
Andalucía;Málaga;Ardales;2641
Andalucía;Málaga;Arenas;1391
Andalucía;Málaga;Arriate;4136
Andalucía;Málaga;Atajate;130
Andalucía;Málaga;Benadalid;257
Andalucía;Málaga;Benahavís;4373
Andalucía;Málaga;Benalauría;503
Andalucía;Málaga;Benalmádena;58854
Andalucía;Málaga;Benamargosa;1631
Andalucía;Málaga;Benamocarra;3061
Andalucía;Málaga;Benaoján;1604
Andalucía;Málaga;Benarrabá;570
Andalucía;Málaga;Borge (El);1026
Andalucía;Málaga;Burgo (El);2004
Andalucía;Málaga;Campillos;8658
Andalucía;Málaga;Cañete la Real;2014
Andalucía;Málaga;Canillas de Aceituno;2323
Andalucía;Málaga;Canillas de Albaida;918
Andalucía;Málaga;Carratraca;896
Andalucía;Málaga;Cartajima;246
Andalucía;Málaga;Cártama;21313
Andalucía;Málaga;Casabermeja;3520
Andalucía;Málaga;Casarabonela;2748
Andalucía;Málaga;Casares;4993
Andalucía;Málaga;Coín;21866
Andalucía;Málaga;Colmenar;3621
Andalucía;Málaga;Comares;1591
Andalucía;Málaga;Cómpeta;3854
Andalucía;Málaga;Cortes de la Frontera;3714
Andalucía;Málaga;Cuevas Bajas;1454
Andalucía;Málaga;Cuevas de San Marcos;4131
Andalucía;Málaga;Cuevas del Becerro;1801
Andalucía;Málaga;Cútar;682
Andalucía;Málaga;Estepona;65592
Andalucía;Málaga;Faraján;275
Andalucía;Málaga;Frigiliana;3071
Andalucía;Málaga;Fuengirola;71482
Andalucía;Málaga;Fuente de Piedra;2783
Andalucía;Málaga;Gaucín;1929
Andalucía;Málaga;Genalguacil;501
Andalucía;Málaga;Guaro;2272
Andalucía;Málaga;Humilladero;3291
Andalucía;Málaga;Igualeja;958
Andalucía;Málaga;Istán;1496
Andalucía;Málaga;Iznate;927
Andalucía;Málaga;Jimera de Líbar;457
Andalucía;Málaga;Jubrique;756
Andalucía;Málaga;Júzcar;218
Andalucía;Málaga;Macharaviaya;501
Andalucía;Málaga;Málaga;568305
Andalucía;Málaga;Manilva;13813
Andalucía;Málaga;Marbella;134623
Andalucía;Málaga;Mijas;73787
Andalucía;Málaga;Moclinejo;1256
Andalucía;Málaga;Mollina;5152
Andalucía;Málaga;Monda;2410
Andalucía;Málaga;Montejaque;1009
Andalucía;Málaga;Nerja;21811
Andalucía;Málaga;Ojén;2805
Andalucía;Málaga;Parauta;231
Andalucía;Málaga;Periana;3611
Andalucía;Málaga;Pizarra;8785
Andalucía;Málaga;Pujerra;337
Andalucía;Málaga;Rincón de la Victoria;38666
Andalucía;Málaga;Riogordo;3102
Andalucía;Málaga;Ronda;36827
Andalucía;Málaga;Salares;214
Andalucía;Málaga;Sayalonga;1564
Andalucía;Málaga;Sedella;699
Andalucía;Málaga;Sierra de Yeguas;3566
Andalucía;Málaga;Teba;4201
Andalucía;Málaga;Tolox;2373
Andalucía;Málaga;Torremolinos;65448
Andalucía;Málaga;Torrox;16890
Andalucía;Málaga;Totalán;722
Andalucía;Málaga;Valle de Abdalajís;2842
Andalucía;Málaga;Vélez-Málaga;74190
Andalucía;Málaga;Villanueva de Algaidas;4560
Andalucía;Málaga;Villanueva de Tapia;1667
Andalucía;Málaga;Villanueva del Rosario;3712
Andalucía;Málaga;Villanueva del Trabuco;5408
Andalucía;Málaga;Viñuela;1994
Andalucía;Málaga;Yunquera;3237
Andalucía;Sevilla;Aguadulce;2124
Andalucía;Sevilla;Alanís;1894
Andalucía;Sevilla;Albaida del Aljarafe;2881
Andalucía;Sevilla;Alcalá de Guadaíra;70155
Andalucía;Sevilla;Alcalá del Río;10869
Andalucía;Sevilla;Alcolea del Río;3394
Andalucía;Sevilla;Algaba (La);14942
Andalucía;Sevilla;Algámitas;1363
Andalucía;Sevilla;Almadén de la Plata;1533
Andalucía;Sevilla;Almensilla;5598
Andalucía;Sevilla;Arahal;19248
Andalucía;Sevilla;Aznalcázar;4064
Andalucía;Sevilla;Aznalcóllar;6185
Andalucía;Sevilla;Badolatosa;3214
Andalucía;Sevilla;Benacazón;6431
Andalucía;Sevilla;Bollullos de la Mitación;8849
Andalucía;Sevilla;Bormujos;18590
Andalucía;Sevilla;Brenes;12460
Andalucía;Sevilla;Burguillos;5781
Andalucía;Sevilla;Cabezas de San Juan (Las);16464
Andalucía;Sevilla;Camas;26015
Andalucía;Sevilla;Campana (La);5469
Andalucía;Sevilla;Cañada Rosal;3198
Andalucía;Sevilla;Cantillana;10627
Andalucía;Sevilla;Carmona;28344
Andalucía;Sevilla;Carrión de los Céspedes;2487
Andalucía;Sevilla;Casariche;5605
Andalucía;Sevilla;Castilblanco de los Arroyos;5150
Andalucía;Sevilla;Castilleja de Guzmán;2744
Andalucía;Sevilla;Castilleja de la Cuesta;17150
Andalucía;Sevilla;Castilleja del Campo;636
Andalucía;Sevilla;Castillo de las Guardas (El);1614
Andalucía;Sevilla;Cazalla de la Sierra;5034
Andalucía;Sevilla;Constantina;6598
Andalucía;Sevilla;Coria del Río;28100
Andalucía;Sevilla;Coripe;1462
Andalucía;Sevilla;Coronil (El);5048
Andalucía;Sevilla;Corrales (Los);4073
Andalucía;Sevilla;Cuervo de Sevilla (El);8562
Andalucía;Sevilla;Dos Hermanas;122943
Andalucía;Sevilla;Écija;40400
Andalucía;Sevilla;Espartinas;12648
Andalucía;Sevilla;Estepa;12632
Andalucía;Sevilla;Fuentes de Andalucía;7358
Andalucía;Sevilla;Garrobo (El);785
Andalucía;Sevilla;Gelves;9083
Andalucía;Sevilla;Gerena;6503
Andalucía;Sevilla;Gilena;3933
Andalucía;Sevilla;Gines;12934
Andalucía;Sevilla;Guadalcanal;2973
Andalucía;Sevilla;Guillena;11109
Andalucía;Sevilla;Herrera;6530
Andalucía;Sevilla;Huévar del Aljarafe;2575
Andalucía;Sevilla;Isla Mayor;5873
Andalucía;Sevilla;Lantejuela (La);3885
Andalucía;Sevilla;Lebrija;26434
Andalucía;Sevilla;Lora de Estepa;857
Andalucía;Sevilla;Lora del Río;19352
Andalucía;Sevilla;Luisiana (La);4608
Andalucía;Sevilla;Madroño (El);348
Andalucía;Sevilla;Mairena del Alcor;20510
Andalucía;Sevilla;Mairena del Aljarafe;40700
Andalucía;Sevilla;Marchena;19768
Andalucía;Sevilla;Marinaleda;2724
Andalucía;Sevilla;Martín de la Jara;2790
Andalucía;Sevilla;Molares (Los);3186
Andalucía;Sevilla;Montellano;7127
Andalucía;Sevilla;Morón de la Frontera;28455
Andalucía;Sevilla;Navas de la Concepción (Las);1749
Andalucía;Sevilla;Olivares;9420
Andalucía;Sevilla;Osuna;17851
Andalucía;Sevilla;Palacios y Villafranca (Los);36824
Andalucía;Sevilla;Palomares del Río;6811
Andalucía;Sevilla;Paradas;7065
Andalucía;Sevilla;Pedrera;5326
Andalucía;Sevilla;Pedroso (El);2267
Andalucía;Sevilla;Peñaflor;3812
Andalucía;Sevilla;Pilas;13386
Andalucía;Sevilla;Pruna;2913
Andalucía;Sevilla;Puebla de Cazalla (La);11325
Andalucía;Sevilla;Puebla de los Infantes (La);3262
Andalucía;Sevilla;Puebla del Río (La);12143
Andalucía;Sevilla;Real de la Jara (El);1626
Andalucía;Sevilla;Rinconada (La);35928
Andalucía;Sevilla;Roda de Andalucía (La);4421
Andalucía;Sevilla;Ronquillo (El);1424
Andalucía;Sevilla;Rubio (El);3587
Andalucía;Sevilla;Salteras;5009
Andalucía;Sevilla;San Juan de Aznalfarache;20779
Andalucía;Sevilla;San Nicolás del Puerto;662
Andalucía;Sevilla;Sanlúcar la Mayor;12749
Andalucía;Sevilla;Santiponce;8135
Andalucía;Sevilla;Saucejo (El);4485
Andalucía;Sevilla;Sevilla;703206
Andalucía;Sevilla;Tocina;9452
Andalucía;Sevilla;Tomares;22772
Andalucía;Sevilla;Umbrete;7698
Andalucía;Sevilla;Utrera;50665
Andalucía;Sevilla;Valencina de la Concepción;7971
Andalucía;Sevilla;Villamanrique de la Condesa;4129
Andalucía;Sevilla;Villanueva de San Juan;1378
Andalucía;Sevilla;Villanueva del Ariscal;6045
Andalucía;Sevilla;Villanueva del Río y Minas;5283
Andalucía;Sevilla;Villaverde del Río;7337
Andalucía;Sevilla;Viso del Alcor (El);18351
Aragón;Huesca;Abiego;286
Aragón;Huesca;Abizanda;126
Aragón;Huesca;Adahuesca;168
Aragón;Huesca;Agüero;166
Aragón;Huesca;Aínsa-Sobrarbe;2179
Aragón;Huesca;Aisa;394
Aragón;Huesca;Albalate de Cinca;1205
Aragón;Huesca;Albalatillo;234
Aragón;Huesca;Albelda;861
Aragón;Huesca;Albero Alto;123
Aragón;Huesca;Albero Bajo;103
Aragón;Huesca;Alberuela de Tubo;358
Aragón;Huesca;Alcalá de Gurrea;282
Aragón;Huesca;Alcalá del Obispo;429
Aragón;Huesca;Alcampell;793
Aragón;Huesca;Alcolea de Cinca;1186
Aragón;Huesca;Alcubierre;440
Aragón;Huesca;Alerre;228
Aragón;Huesca;Alfántega;135
Aragón;Huesca;Almudévar;2552
Aragón;Huesca;Almunia de San Juan;654
Aragón;Huesca;Almuniente;567
Aragón;Huesca;Alquézar;321
Aragón;Huesca;Altorricón;1518
Aragón;Huesca;Angüés;431
Aragón;Huesca;Ansó;497
Aragón;Huesca;Antillón;156
Aragón;Huesca;Aragüés del Puerto;132
Aragón;Huesca;Arén;320
Aragón;Huesca;Argavieso;125
Aragón;Huesca;Arguis;111
Aragón;Huesca;Ayerbe;1125
Aragón;Huesca;Azanuy-Alins;194
Aragón;Huesca;Azara;203
Aragón;Huesca;Azlor;136
Aragón;Huesca;Baélls;119
Aragón;Huesca;Bailo;243
Aragón;Huesca;Baldellou;114
Aragón;Huesca;Ballobar;987
Aragón;Huesca;Banastás;268
Aragón;Huesca;Barbastro;16924
Aragón;Huesca;Barbués;103
Aragón;Huesca;Barbuñales;107
Aragón;Huesca;Bárcabo;124
Aragón;Huesca;Belver de Cinca;1380
Aragón;Huesca;Benabarre;1199
Aragón;Huesca;Benasque;2200
Aragón;Huesca;Berbegal;450
Aragón;Huesca;Bielsa;508
Aragón;Huesca;Bierge;262
Aragón;Huesca;Biescas;1675
Aragón;Huesca;Binaced;1528
Aragón;Huesca;Binéfar;9444
Aragón;Huesca;Bisaurri;226
Aragón;Huesca;Biscarrués;234
Aragón;Huesca;Blecua y Torres;192
Aragón;Huesca;Boltaña;1035
Aragón;Huesca;Bonansa;96
Aragón;Huesca;Borau;71
Aragón;Huesca;Broto;547
Aragón;Huesca;Caldearenas;246
Aragón;Huesca;Campo;246
Aragón;Huesca;Camporrélls;196
Aragón;Huesca;Canal de Berdún;401
Aragón;Huesca;Candasnos;419
Aragón;Huesca;Canfranc;625
Aragón;Huesca;Capdesaso;161
Aragón;Huesca;Capella;382
Aragón;Huesca;Casbas de Huesca;304
Aragón;Huesca;Castejón de Monegros;670
Aragón;Huesca;Castejón de Sos;787
Aragón;Huesca;Castejón del Puente;424
Aragón;Huesca;Castelflorite;136
Aragón;Huesca;Castiello de Jaca;265
Aragón;Huesca;Castigaleu;121
Aragón;Huesca;Castillazuelo;199
Aragón;Huesca;Castillonroy;390
Aragón;Huesca;Chalamera;135
Aragón;Huesca;Chía;101
Aragón;Huesca;Chimillas;341
Aragón;Huesca;Colungo;157
Aragón;Huesca;Esplús;681
Aragón;Huesca;Estada;237
Aragón;Huesca;Estadilla;866
Aragón;Huesca;Estopiñán del Castillo;181
Aragón;Huesca;Fago;31
Aragón;Huesca;Fanlo;149
Aragón;Huesca;Fiscal;330
Aragón;Huesca;Fonz;1034
Aragón;Huesca;Foradada del Toscar;226
Aragón;Huesca;Fraga;14302
Aragón;Huesca;Fueva (La);626
Aragón;Huesca;Gistaín;154
Aragón;Huesca;Grado (El);506
Aragón;Huesca;Grañén;2038
Aragón;Huesca;Graus;3665
Aragón;Huesca;Gurrea de Gállego;1706
Aragón;Huesca;Hoz de Jaca;70
Aragón;Huesca;Hoz y Costean;211
Aragón;Huesca;Huerto;278
Aragón;Huesca;Huesca;52059
Aragón;Huesca;Ibieca;110
Aragón;Huesca;Igriés;598
Aragón;Huesca;Ilche;259
Aragón;Huesca;Isábena;327
Aragón;Huesca;Jaca;13396
Aragón;Huesca;Jasa;125
Aragón;Huesca;Labuerda;172
Aragón;Huesca;Laluenga;233
Aragón;Huesca;Lalueza;1132
Aragón;Huesca;Lanaja;1460
Aragón;Huesca;Laperdiguera;102
Aragón;Huesca;Lascellas-Ponzano;151
Aragón;Huesca;Lascuarre;158
Aragón;Huesca;Laspaúles;309
Aragón;Huesca;Laspuña;294
Aragón;Huesca;Loarre;376
Aragón;Huesca;Loporzano;542
Aragón;Huesca;Loscorrales;114
Aragón;Huesca;Lupiñén-Ortilla;387
Aragón;Huesca;Monesma y Cajigar;111
Aragón;Huesca;Monflorite-Lascasas;296
Aragón;Huesca;Montanuy;296
Aragón;Huesca;Monzón;17042
Aragón;Huesca;Naval;266
Aragón;Huesca;Novales;180
Aragón;Huesca;Nueno;555
Aragón;Huesca;Olvena;61
Aragón;Huesca;Ontiñena;602
Aragón;Huesca;Osso de Cinca;782
Aragón;Huesca;Palo;28
Aragón;Huesca;Panticosa;832
Aragón;Huesca;Peñalba;741
Aragón;Huesca;Peñas de Riglos (Las);272
Aragón;Huesca;Peralta de Alcofea;639
Aragón;Huesca;Peralta de Calasanz;232
Aragón;Huesca;Peraltilla;198
Aragón;Huesca;Perarrúa;98
Aragón;Huesca;Pertusa;110
Aragón;Huesca;Piracés;96
Aragón;Huesca;Plan;332
Aragón;Huesca;Poleñino;222
Aragón;Huesca;Pozán de Vero;250
Aragón;Huesca;Puebla de Castro (La);428
Aragón;Huesca;Puente de Montañana;155
Aragón;Huesca;Puente la Reina de Jaca;218
Aragón;Huesca;Puértolas;239
Aragón;Huesca;Pueyo de Araguás (El);153
Aragón;Huesca;Pueyo de Santa Cruz;370
Aragón;Huesca;Quicena;305
Aragón;Huesca;Robres;632
Aragón;Huesca;Sabiñánigo;10378
Aragón;Huesca;Sahún;368
Aragón;Huesca;Salas Altas;305
Aragón;Huesca;Salas Bajas;136
Aragón;Huesca;Salillas;115
Aragón;Huesca;Sallent de Gállego;1480
Aragón;Huesca;San Esteban de Litera;527
Aragón;Huesca;San Juan de Plan;153
Aragón;Huesca;San Miguel del Cinca;853
Aragón;Huesca;Sangarrén;257
Aragón;Huesca;Santa Cilia;207
Aragón;Huesca;Santa Cruz de la Serós;140
Aragón;Huesca;Santa María de Dulcis;211
Aragón;Huesca;Santaliestra y San Quílez;108
Aragón;Huesca;Sariñena;4455
Aragón;Huesca;Secastilla;141
Aragón;Huesca;Seira;165
Aragón;Huesca;Sena;548
Aragón;Huesca;Senés de Alcubierre;60
Aragón;Huesca;Sesa;233
Aragón;Huesca;Sesué;121
Aragón;Huesca;Siétamo;635
Aragón;Huesca;Sopeira;111
Aragón;Huesca;Sotonera (La);1075
Aragón;Huesca;Tamarite de Litera;3743
Aragón;Huesca;Tardienta;1035
Aragón;Huesca;Tella-Sin;291
Aragón;Huesca;Tierz;646
Aragón;Huesca;Tolva;175
Aragón;Huesca;Torla;324
Aragón;Huesca;Torralba de Aragón;113
Aragón;Huesca;Torre la Ribera;118
Aragón;Huesca;Torrente de Cinca;1370
Aragón;Huesca;Torres de Alcanadre;113
Aragón;Huesca;Torres de Barbués;318
Aragón;Huesca;Tramaced;100
Aragón;Huesca;Valfarta;90
Aragón;Huesca;Valle de Bardají;52
Aragón;Huesca;Valle de Hecho;954
Aragón;Huesca;Valle de Lierp;42
Aragón;Huesca;Velilla de Cinca;465
Aragón;Huesca;Vencillón;479
Aragón;Huesca;Veracruz;99
Aragón;Huesca;Viacamp y Litera;50
Aragón;Huesca;Vicién;131
Aragón;Huesca;Villanova;150
Aragón;Huesca;Villanúa;477
Aragón;Huesca;Villanueva de Sigena;512
Aragón;Huesca;Yebra de Basa;158
Aragón;Huesca;Yésero;77
Aragón;Huesca;Zaidín;1729
Aragón;Teruel;Ababuj;80
Aragón;Teruel;Abejuela;57
Aragón;Teruel;Aguatón;21
Aragón;Teruel;Aguaviva;713
Aragón;Teruel;Aguilar del Alfambra;66
Aragón;Teruel;Alacón;384
Aragón;Teruel;Alba;250
Aragón;Teruel;Albalate del Arzobispo;2195
Aragón;Teruel;Albarracín;1097
Aragón;Teruel;Albentosa;317
Aragón;Teruel;Alcaine;67
Aragón;Teruel;Alcalá de la Selva;513
Aragón;Teruel;Alcañiz;16392
Aragón;Teruel;Alcorisa;3698
Aragón;Teruel;Alfambra;723
Aragón;Teruel;Aliaga;384
Aragón;Teruel;Allepuz;134
Aragón;Teruel;Alloza;711
Aragón;Teruel;Allueva;15
Aragón;Teruel;Almohaja;23
Aragón;Teruel;Alobras;70
Aragón;Teruel;Alpeñés;25
Aragón;Teruel;Anadón;20
Aragón;Teruel;Andorra;8403
Aragón;Teruel;Arcos de las Salinas;122
Aragón;Teruel;Arens de Lledó;214
Aragón;Teruel;Argente;241
Aragón;Teruel;Ariño;950
Aragón;Teruel;Azaila;154
Aragón;Teruel;Bádenas;25
Aragón;Teruel;Báguena;410
Aragón;Teruel;Bañón;171
Aragón;Teruel;Barrachina;157
Aragón;Teruel;Bea;37
Aragón;Teruel;Beceite;621
Aragón;Teruel;Bello;285
Aragón;Teruel;Belmonte de San José;145
Aragón;Teruel;Berge;273
Aragón;Teruel;Bezas;78
Aragón;Teruel;Blancas;159
Aragón;Teruel;Blesa;123
Aragón;Teruel;Bordón;142
Aragón;Teruel;Bronchales;483
Aragón;Teruel;Bueña;71
Aragón;Teruel;Burbáguena;310
Aragón;Teruel;Cabra de Mora;89
Aragón;Teruel;Calaceite;1131
Aragón;Teruel;Calamocha;4776
Aragón;Teruel;Calanda;3899
Aragón;Teruel;Calomarde;92
Aragón;Teruel;Camañas;117
Aragón;Teruel;Camarena de la Sierra;167
Aragón;Teruel;Camarillas;112
Aragón;Teruel;Caminreal;765
Aragón;Teruel;Cañada de Benatanduz;48
Aragón;Teruel;Cañada de Verich (La);108
Aragón;Teruel;Cañada Vellida;44
Aragón;Teruel;Cañizar del Olivar;117
Aragón;Teruel;Cantavieja;758
Aragón;Teruel;Cascante del Río;80
Aragón;Teruel;Castejón de Tornos;69
Aragón;Teruel;Castel de Cabra;143
Aragón;Teruel;Castellar (El);76
Aragón;Teruel;Castellote;824
Aragón;Teruel;Castelnou;109
Aragón;Teruel;Castelserás;828
Aragón;Teruel;Cedrillas;612
Aragón;Teruel;Celadas;443
Aragón;Teruel;Cella;3112
Aragón;Teruel;Cerollera (La);121
Aragón;Teruel;Codoñera (La);391
Aragón;Teruel;Corbalán;95
Aragón;Teruel;Cortes de Aragón;80
Aragón;Teruel;Cosa;67
Aragón;Teruel;Cretas;629
Aragón;Teruel;Crivillén;95
Aragón;Teruel;Cuba (La);63
Aragón;Teruel;Cubla;55
Aragón;Teruel;Cucalón;108
Aragón;Teruel;Cuervo (El);109
Aragón;Teruel;Cuevas de Almudén;125
Aragón;Teruel;Cuevas Labradas;141
Aragón;Teruel;Ejulve;203
Aragón;Teruel;Escorihuela;199
Aragón;Teruel;Escucha;1003
Aragón;Teruel;Estercuel;267
Aragón;Teruel;Ferreruela de Huerva;77
Aragón;Teruel;Fonfría;30
Aragón;Teruel;Formiche Alto;195
Aragón;Teruel;Fórnoles;99
Aragón;Teruel;Fortanete;237
Aragón;Teruel;Foz-Calanda;319
Aragón;Teruel;Fresneda (La);501
Aragón;Teruel;Frías de Albarracín;163
Aragón;Teruel;Fuenferrada;38
Aragón;Teruel;Fuentes Calientes;120
Aragón;Teruel;Fuentes Claras;663
Aragón;Teruel;Fuentes de Rubielos;137
Aragón;Teruel;Fuentespalda;342
Aragón;Teruel;Galve;144
Aragón;Teruel;Gargallo;102
Aragón;Teruel;Gea de Albarracín;442
Aragón;Teruel;Ginebrosa (La);224
Aragón;Teruel;Griegos;140
Aragón;Teruel;Guadalaviar;252
Aragón;Teruel;Gúdar;87
Aragón;Teruel;Híjar;1900
Aragón;Teruel;Hinojosa de Jarque;153
Aragón;Teruel;Hoz de la Vieja (La);96
Aragón;Teruel;Huesa del Común;97
Aragón;Teruel;Iglesuela del Cid (La);502
Aragón;Teruel;Jabaloyas;89
Aragón;Teruel;Jarque de la Val;99
Aragón;Teruel;Jatiel;55
Aragón;Teruel;Jorcas;42
Aragón;Teruel;Josa;29
Aragón;Teruel;Lagueruela;66
Aragón;Teruel;Lanzuela;28
Aragón;Teruel;Libros;148
Aragón;Teruel;Lidón;63
Aragón;Teruel;Linares de Mora;328
Aragón;Teruel;Lledó;175
Aragón;Teruel;Loscos;176
Aragón;Teruel;Maicas;37
Aragón;Teruel;Manzanera;561
Aragón;Teruel;Martín del Río;467
Aragón;Teruel;Mas de las Matas;1436
Aragón;Teruel;Mata de los Olmos (La);271
Aragón;Teruel;Mazaleón;588
Aragón;Teruel;Mezquita de Jarque;124
Aragón;Teruel;Mirambel;132
Aragón;Teruel;Miravete de la Sierra;42
Aragón;Teruel;Molinos;312
Aragón;Teruel;Monforte de Moyuela;80
Aragón;Teruel;Monreal del Campo;2744
Aragón;Teruel;Monroyo;395
Aragón;Teruel;Montalbán;1448
Aragón;Teruel;Monteagudo del Castillo;80
Aragón;Teruel;Monterde de Albarracín;73
Aragón;Teruel;Mora de Rubielos;1756
Aragón;Teruel;Moscardón;63
Aragón;Teruel;Mosqueruela;625
Aragón;Teruel;Muniesa;684
Aragón;Teruel;Noguera de Albarracín;142
Aragón;Teruel;Nogueras;34
Aragón;Teruel;Nogueruelas;249
Aragón;Teruel;Obón;42
Aragón;Teruel;Odón;221
Aragón;Teruel;Ojos Negros;510
Aragón;Teruel;Olba;231
Aragón;Teruel;Oliete;486
Aragón;Teruel;Olmos (Los);136
Aragón;Teruel;Orihuela del Tremedal;562
Aragón;Teruel;Orrios;168
Aragón;Teruel;Palomar de Arroyos;208
Aragón;Teruel;Pancrudo;110
Aragón;Teruel;Parras de Castellote (Las);73
Aragón;Teruel;Peñarroya de Tastavins;532
Aragón;Teruel;Peracense;93
Aragón;Teruel;Peralejos;79
Aragón;Teruel;Perales del Alfambra;278
Aragón;Teruel;Pitarque;95
Aragón;Teruel;Plou;47
Aragón;Teruel;Pobo (El);133
Aragón;Teruel;Portellada (La);262
Aragón;Teruel;Pozondón;83
Aragón;Teruel;Pozuel del Campo;101
Aragón;Teruel;Puebla de Híjar (La);1024
Aragón;Teruel;Puebla de Valverde (La);569
Aragón;Teruel;Puertomingalvo;228
Aragón;Teruel;Ráfales;160
Aragón;Teruel;Rillo;100
Aragón;Teruel;Riodeva;199
Aragón;Teruel;Ródenas;71
Aragón;Teruel;Royuela;240
Aragón;Teruel;Rubiales;56
Aragón;Teruel;Rubielos de la Cérida;46
Aragón;Teruel;Rubielos de Mora;780
Aragón;Teruel;Salcedillo;10
Aragón;Teruel;Saldón;29
Aragón;Teruel;Samper de Calanda;928
Aragón;Teruel;San Agustín;154
Aragón;Teruel;San Martín del Río;204
Aragón;Teruel;Santa Cruz de Nogueras;31
Aragón;Teruel;Santa Eulalia;1185
Aragón;Teruel;Sarrión;1155
Aragón;Teruel;Segura de los Baños;40
Aragón;Teruel;Seno;47
Aragón;Teruel;Singra;95
Aragón;Teruel;Terriente;187
Aragón;Teruel;Teruel;35396
Aragón;Teruel;Toril y Masegoso;36
Aragón;Teruel;Tormón;33
Aragón;Teruel;Tornos;234
Aragón;Teruel;Torralba de los Sisones;228
Aragón;Teruel;Torre de Arcas;105
Aragón;Teruel;Torre de las Arcas;39
Aragón;Teruel;Torre del Compte;158
Aragón;Teruel;Torre los Negros;95
Aragón;Teruel;Torrecilla de Alcañiz;435
Aragón;Teruel;Torrecilla del Rebollar;151
Aragón;Teruel;Torrelacárcel;231
Aragón;Teruel;Torremocha de Jiloca;143
Aragón;Teruel;Torres de Albarracín;161
Aragón;Teruel;Torrevelilla;194
Aragón;Teruel;Torrijas;62
Aragón;Teruel;Torrijo del Campo;566
Aragón;Teruel;Tramacastiel;100
Aragón;Teruel;Tramacastilla;113
Aragón;Teruel;Tronchón;110
Aragón;Teruel;Urrea de Gaén;530
Aragón;Teruel;Utrillas;3388
Aragón;Teruel;Valacloche;33
Aragón;Teruel;Valbona;228
Aragón;Teruel;Valdealgorfa;667
Aragón;Teruel;Valdecuenca;54
Aragón;Teruel;Valdelinares;106
Aragón;Teruel;Valdeltormo;329
Aragón;Teruel;Valderrobres;2285
Aragón;Teruel;Valjunquera;417
Aragón;Teruel;Vallecillo (El);45
Aragón;Teruel;Veguillas de la Sierra;27
Aragón;Teruel;Villafranca del Campo;361
Aragón;Teruel;Villahermosa del Campo;98
Aragón;Teruel;Villanueva del Rebollar de la Sierra;48
Aragón;Teruel;Villar del Cobo;217
Aragón;Teruel;Villar del Salz;85
Aragón;Teruel;Villarluengo;191
Aragón;Teruel;Villarquemado;968
Aragón;Teruel;Villarroya de los Pinares;190
Aragón;Teruel;Villastar;427
Aragón;Teruel;Villel;382
Aragón;Teruel;Vinaceite;330
Aragón;Teruel;Visiedo;154
Aragón;Teruel;Vivel del Río Martín;91
Aragón;Teruel;Zoma (La);22
Aragón;Zaragoza;Abanto;125
Aragón;Zaragoza;Acered;169
Aragón;Zaragoza;Agón;170
Aragón;Zaragoza;Aguarón;896
Aragón;Zaragoza;Aguilón;256
Aragón;Zaragoza;Ainzón;1277
Aragón;Zaragoza;Aladrén;60
Aragón;Zaragoza;Alagón;7195
Aragón;Zaragoza;Alarba;156
Aragón;Zaragoza;Alberite de San Juan;102
Aragón;Zaragoza;Albeta;137
Aragón;Zaragoza;Alborge;124
Aragón;Zaragoza;Alcalá de Ebro;290
Aragón;Zaragoza;Alcalá de Moncayo;155
Aragón;Zaragoza;Alconchel de Ariza;106
Aragón;Zaragoza;Aldehuela de Liestos;53
Aragón;Zaragoza;Alfajarín;2053
Aragón;Zaragoza;Alfamén;1513
Aragón;Zaragoza;Alforque;87
Aragón;Zaragoza;Alhama de Aragón;1225
Aragón;Zaragoza;Almochuel;29
Aragón;Zaragoza;Almolda (La);631
Aragón;Zaragoza;Almonacid de la Cuba;289
Aragón;Zaragoza;Almonacid de la Sierra;815
Aragón;Zaragoza;Almunia de Doña Godina (La);7911
Aragón;Zaragoza;Alpartir;560
Aragón;Zaragoza;Ambel;311
Aragón;Zaragoza;Anento;135
Aragón;Zaragoza;Aniñón;829
Aragón;Zaragoza;Añón de Moncayo;220
Aragón;Zaragoza;Aranda de Moncayo;223
Aragón;Zaragoza;Arándiga;407
Aragón;Zaragoza;Ardisa;80
Aragón;Zaragoza;Ariza;1267
Aragón;Zaragoza;Artieda;100
Aragón;Zaragoza;Asín;108
Aragón;Zaragoza;Atea;130
Aragón;Zaragoza;Ateca;2113
Aragón;Zaragoza;Azuara;710
Aragón;Zaragoza;Badules;100
Aragón;Zaragoza;Bagüés;28
Aragón;Zaragoza;Balconchán;11
Aragón;Zaragoza;Bárboles;352
Aragón;Zaragoza;Bardallur;316
Aragón;Zaragoza;Belchite;1671
Aragón;Zaragoza;Belmonte de Gracián;215
Aragón;Zaragoza;Berdejo;64
Aragón;Zaragoza;Berrueco;40
Aragón;Zaragoza;Biel;200
Aragón;Zaragoza;Bijuesca;114
Aragón;Zaragoza;Biota;1131
Aragón;Zaragoza;Bisimbre;109
Aragón;Zaragoza;Boquiñeni;1025
Aragón;Zaragoza;Bordalba;79
Aragón;Zaragoza;Borja;5030
Aragón;Zaragoza;Botorrita;540
Aragón;Zaragoza;Brea de Aragón;1897
Aragón;Zaragoza;Bubierca;82
Aragón;Zaragoza;Bujaraloz;1048
Aragón;Zaragoza;Bulbuente;265
Aragón;Zaragoza;Bureta;279
Aragón;Zaragoza;Burgo de Ebro (El);2298
Aragón;Zaragoza;Buste (El);90
Aragón;Zaragoza;Cabañas de Ebro;558
Aragón;Zaragoza;Cabolafuente;49
Aragón;Zaragoza;Cadrete;2777
Aragón;Zaragoza;Calatayud;21933
Aragón;Zaragoza;Calatorao;3072
Aragón;Zaragoza;Calcena;50
Aragón;Zaragoza;Calmarza;75
Aragón;Zaragoza;Campillo de Aragón;158
Aragón;Zaragoza;Carenas;203
Aragón;Zaragoza;Cariñena;3665
Aragón;Zaragoza;Caspe;9728
Aragón;Zaragoza;Castejón de Alarba;107
Aragón;Zaragoza;Castejón de las Armas;117
Aragón;Zaragoza;Castejón de Valdejasa;290
Aragón;Zaragoza;Castiliscar;333
Aragón;Zaragoza;Cervera de la Cañada;322
Aragón;Zaragoza;Cerveruela;41
Aragón;Zaragoza;Cetina;717
Aragón;Zaragoza;Chiprana;290
Aragón;Zaragoza;Chodes;154
Aragón;Zaragoza;Cimballa;123
Aragón;Zaragoza;Cinco Olivas;118
Aragón;Zaragoza;Clarés de Ribota;93
Aragón;Zaragoza;Codo;212
Aragón;Zaragoza;Codos;260
Aragón;Zaragoza;Contamina;38
Aragón;Zaragoza;Cosuenda;392
Aragón;Zaragoza;Cuarte de Huerva;7687
Aragón;Zaragoza;Cubel;200
Aragón;Zaragoza;Cuerlas (Las);68
Aragón;Zaragoza;Daroca;2331
Aragón;Zaragoza;Ejea de los Caballeros;17331
Aragón;Zaragoza;Embid de Ariza;56
Aragón;Zaragoza;Encinacorba;264
Aragón;Zaragoza;Épila;4691
Aragón;Zaragoza;Erla;420
Aragón;Zaragoza;Escatrón;1163
Aragón;Zaragoza;Fabara;1225
Aragón;Zaragoza;Farlete;432
Aragón;Zaragoza;Fayón;422
Aragón;Zaragoza;Fayos (Los);158
Aragón;Zaragoza;Figueruelas;1351
Aragón;Zaragoza;Fombuena;51
Aragón;Zaragoza;Frago (El);115
Aragón;Zaragoza;Frasno (El);479
Aragón;Zaragoza;Fréscano;235
Aragón;Zaragoza;Fuendejalón;969
Aragón;Zaragoza;Fuendetodos;169
Aragón;Zaragoza;Fuentes de Ebro;4596
Aragón;Zaragoza;Fuentes de Jiloca;282
Aragón;Zaragoza;Gallocanta;153
Aragón;Zaragoza;Gallur;3026
Aragón;Zaragoza;Gelsa;1226
Aragón;Zaragoza;Godojos;52
Aragón;Zaragoza;Gotor;391
Aragón;Zaragoza;Grisel;84
Aragón;Zaragoza;Grisén;549
Aragón;Zaragoza;Herrera de los Navarros;630
Aragón;Zaragoza;Ibdes;510
Aragón;Zaragoza;Illueca;3381
Aragón;Zaragoza;Isuerre;37
Aragón;Zaragoza;Jaraba;358
Aragón;Zaragoza;Jarque;546
Aragón;Zaragoza;Jaulín;305
Aragón;Zaragoza;Joyosa (La);902
Aragón;Zaragoza;Lagata;137
Aragón;Zaragoza;Langa del Castillo;152
Aragón;Zaragoza;Layana;111
Aragón;Zaragoza;Lécera;732
Aragón;Zaragoza;Lechón;54
Aragón;Zaragoza;Leciñena;1299
Aragón;Zaragoza;Letux;452
Aragón;Zaragoza;Litago;180
Aragón;Zaragoza;Lituénigo;117
Aragón;Zaragoza;Lobera de Onsella;49
Aragón;Zaragoza;Longares;896
Aragón;Zaragoza;Longás;39
Aragón;Zaragoza;Lucena de Jalón;321
Aragón;Zaragoza;Luceni;1101
Aragón;Zaragoza;Luesia;377
Aragón;Zaragoza;Luesma;37
Aragón;Zaragoza;Lumpiaque;1050
Aragón;Zaragoza;Luna;861
Aragón;Zaragoza;Maella;2027
Aragón;Zaragoza;Magallón;1223
Aragón;Zaragoza;Mainar;169
Aragón;Zaragoza;Malanquilla;123
Aragón;Zaragoza;Maleján;330
Aragón;Zaragoza;Mallén;3731
Aragón;Zaragoza;Malón;385
Aragón;Zaragoza;Maluenda;1100
Aragón;Zaragoza;Manchones;127
Aragón;Zaragoza;Mara;204
Aragón;Zaragoza;María de Huerva;4444
Aragón;Zaragoza;Marracos;104
Aragón;Zaragoza;Mediana de Aragón;492
Aragón;Zaragoza;Mequinenza;2492
Aragón;Zaragoza;Mesones de Isuela;318
Aragón;Zaragoza;Mezalocha;237
Aragón;Zaragoza;Mianos;46
Aragón;Zaragoza;Miedes de Aragón;471
Aragón;Zaragoza;Monegrillo;495
Aragón;Zaragoza;Moneva;128
Aragón;Zaragoza;Monreal de Ariza;197
Aragón;Zaragoza;Monterde;198
Aragón;Zaragoza;Montón;129
Aragón;Zaragoza;Morata de Jalón;1360
Aragón;Zaragoza;Morata de Jiloca;306
Aragón;Zaragoza;Morés;443
Aragón;Zaragoza;Moros;481
Aragón;Zaragoza;Moyuela;280
Aragón;Zaragoza;Mozota;118
Aragón;Zaragoza;Muel;1388
Aragón;Zaragoza;Muela (La);4928
Aragón;Zaragoza;Munébrega;469
Aragón;Zaragoza;Murero;153
Aragón;Zaragoza;Murillo de Gállego;165
Aragón;Zaragoza;Navardún;49
Aragón;Zaragoza;Nigüella;84
Aragón;Zaragoza;Nombrevilla;36
Aragón;Zaragoza;Nonaspe;1083
Aragón;Zaragoza;Novallas;891
Aragón;Zaragoza;Novillas;639
Aragón;Zaragoza;Nuévalos;361
Aragón;Zaragoza;Nuez de Ebro;758
Aragón;Zaragoza;Olvés;119
Aragón;Zaragoza;Orcajo;34
Aragón;Zaragoza;Orera;126
Aragón;Zaragoza;Orés;101
Aragón;Zaragoza;Oseja;51
Aragón;Zaragoza;Osera de Ebro;457
Aragón;Zaragoza;Paniza;770
Aragón;Zaragoza;Paracuellos de Jiloca;554
Aragón;Zaragoza;Paracuellos de la Ribera;199
Aragón;Zaragoza;Pastriz;1392
Aragón;Zaragoza;Pedrola;3667
Aragón;Zaragoza;Pedrosas (Las);120
Aragón;Zaragoza;Perdiguera;662
Aragón;Zaragoza;Piedratajada;152
Aragón;Zaragoza;Pina de Ebro;2597
Aragón;Zaragoza;Pinseque;3423
Aragón;Zaragoza;Pintanos (Los);38
Aragón;Zaragoza;Plasencia de Jalón;404
Aragón;Zaragoza;Pleitas;51
Aragón;Zaragoza;Plenas;125
Aragón;Zaragoza;Pomer;38
Aragón;Zaragoza;Pozuel de Ariza;22
Aragón;Zaragoza;Pozuelo de Aragón;341
Aragón;Zaragoza;Pradilla de Ebro;638
Aragón;Zaragoza;Puebla de Albortón;129
Aragón;Zaragoza;Puebla de Alfindén (La);5033
Aragón;Zaragoza;Puendeluna;58
Aragón;Zaragoza;Purujosa;48
Aragón;Zaragoza;Quinto;2108
Aragón;Zaragoza;Remolinos;1192
Aragón;Zaragoza;Retascón;84
Aragón;Zaragoza;Ricla;3469
Aragón;Zaragoza;Romanos;114
Aragón;Zaragoza;Rueda de Jalón;353
Aragón;Zaragoza;Ruesca;80
Aragón;Zaragoza;Sabiñán;805
Aragón;Zaragoza;Sádaba;1666
Aragón;Zaragoza;Salillas de Jalón;371
Aragón;Zaragoza;Salvatierra de Esca;244
Aragón;Zaragoza;Samper del Salz;123
Aragón;Zaragoza;San Martín de la Virgen de Moncayo;300
Aragón;Zaragoza;San Mateo de Gállego;3009
Aragón;Zaragoza;Santa Cruz de Grío;182
Aragón;Zaragoza;Santa Cruz de Moncayo;131
Aragón;Zaragoza;Santa Eulalia de Gállego;119
Aragón;Zaragoza;Santed;61
Aragón;Zaragoza;Sástago;1115
Aragón;Zaragoza;Sediles;109
Aragón;Zaragoza;Sestrica;406
Aragón;Zaragoza;Sierra de Luna;311
Aragón;Zaragoza;Sigüés;137
Aragón;Zaragoza;Sisamón;51
Aragón;Zaragoza;Sobradiel;967
Aragón;Zaragoza;Sos del Rey Católico;690
Aragón;Zaragoza;Tabuenca;411
Aragón;Zaragoza;Talamantes;62
Aragón;Zaragoza;Tarazona;11211
Aragón;Zaragoza;Tauste;7710
Aragón;Zaragoza;Terrer;526
Aragón;Zaragoza;Tierga;189
Aragón;Zaragoza;Tobed;238
Aragón;Zaragoza;Torralba de los Frailes;99
Aragón;Zaragoza;Torralba de Ribota;200
Aragón;Zaragoza;Torralbilla;66
Aragón;Zaragoza;Torrehermosa;87
Aragón;Zaragoza;Torrelapaja;42
Aragón;Zaragoza;Torrellas;301
Aragón;Zaragoza;Torres de Berrellén;1523
Aragón;Zaragoza;Torrijo de la Cañada;285
Aragón;Zaragoza;Tosos;244
Aragón;Zaragoza;Trasmoz;82
Aragón;Zaragoza;Trasobares;158
Aragón;Zaragoza;Uncastillo;801
Aragón;Zaragoza;Undués de Lerda;71
Aragón;Zaragoza;Urrea de Jalón;423
Aragón;Zaragoza;Urriés;39
Aragón;Zaragoza;Used;342
Aragón;Zaragoza;Utebo;17677
Aragón;Zaragoza;Val de San Martín;85
Aragón;Zaragoza;Valdehorna;38
Aragón;Zaragoza;Valmadrid;102
Aragón;Zaragoza;Valpalmas;160
Aragón;Zaragoza;Valtorres;114
Aragón;Zaragoza;Velilla de Ebro;261
Aragón;Zaragoza;Velilla de Jiloca;104
Aragón;Zaragoza;Vera de Moncayo;425
Aragón;Zaragoza;Vierlas;95
Aragón;Zaragoza;Villadoz;88
Aragón;Zaragoza;Villafeliche;185
Aragón;Zaragoza;Villafranca de Ebro;777
Aragón;Zaragoza;Villalba de Perejil;111
Aragón;Zaragoza;Villalengua;387
Aragón;Zaragoza;Villamayor de Gállego;2868
Aragón;Zaragoza;Villanueva de Gállego;4255
Aragón;Zaragoza;Villanueva de Huerva;588
Aragón;Zaragoza;Villanueva de Jiloca;74
Aragón;Zaragoza;Villar de los Navarros;121
Aragón;Zaragoza;Villarreal de Huerva;202
Aragón;Zaragoza;Villarroya de la Sierra;585
Aragón;Zaragoza;Villarroya del Campo;74
Aragón;Zaragoza;Vilueña (La);110
Aragón;Zaragoza;Vistabella;45
Aragón;Zaragoza;Zaida (La);534
Aragón;Zaragoza;Zaragoza;674317
Aragón;Zaragoza;Zuera;7427
Asturias;Asturias;Allande;2068
Asturias;Asturias;Aller;12766
Asturias;Asturias;Amieva;815
Asturias;Asturias;Avilés;84242
Asturias;Asturias;Belmonte de Miranda;1807
Asturias;Asturias;Bimenes;1880
Asturias;Asturias;Boal;1979
Asturias;Asturias;Cabrales;2237
Asturias;Asturias;Cabranes;1101
Asturias;Asturias;Candamo;2180
Asturias;Asturias;Cangas de Onís;6761
Asturias;Asturias;Cangas del Narcea;14589
Asturias;Asturias;Caravia;536
Asturias;Asturias;Carreño;10936
Asturias;Asturias;Caso;1869
Asturias;Asturias;Castrillón;22894
Asturias;Asturias;Castropol;3845
Asturias;Asturias;Coaña;3442
Asturias;Asturias;Colunga;3878
Asturias;Asturias;Corvera de Asturias;15955
Asturias;Asturias;Cudillero;5797
Asturias;Asturias;Degaña;1233
Asturias;Asturias;Franco (El);4073
Asturias;Asturias;Gijón;277554
Asturias;Asturias;Gozón;10738
Asturias;Asturias;Grado;11033
Asturias;Asturias;Grandas de Salime;1075
Asturias;Asturias;Ibias;1711
Asturias;Asturias;Illano;480
Asturias;Asturias;Illas;1009
Asturias;Asturias;Langreo;45565
Asturias;Asturias;Laviana;14210
Asturias;Asturias;Lena;12766
Asturias;Asturias;Llanera;13776
Asturias;Asturias;Llanes;14013
Asturias;Asturias;Mieres;44070
Asturias;Asturias;Morcín;2964
Asturias;Asturias;Muros de Nalón;1970
Asturias;Asturias;Nava;5594
Asturias;Asturias;Navia;9190
Asturias;Asturias;Noreña;5415
Asturias;Asturias;Onís;803
Asturias;Asturias;Oviedo;224005
Asturias;Asturias;Parres;5842
Asturias;Asturias;Peñamellera Alta;600
Asturias;Asturias;Peñamellera Baja;1391
Asturias;Asturias;Pesoz;193
Asturias;Asturias;Piloña;8060
Asturias;Asturias;Ponga;684
Asturias;Asturias;Pravia;9131
Asturias;Asturias;Proaza;797
Asturias;Asturias;Quirós;1389
Asturias;Asturias;Regueras (Las);2025
Asturias;Asturias;Ribadedeva;1852
Asturias;Asturias;Ribadesella;6296
Asturias;Asturias;Ribera de Arriba;1973
Asturias;Asturias;Riosa;2200
Asturias;Asturias;Salas;5962
Asturias;Asturias;San Martín de Oscos;448
Asturias;Asturias;San Martín del Rey Aurelio;18729
Asturias;Asturias;San Tirso de Abres;556
Asturias;Asturias;Santa Eulalia de Oscos;515
Asturias;Asturias;Santo Adriano;253
Asturias;Asturias;Sariego;1331
Asturias;Asturias;Siero;51181
Asturias;Asturias;Sobrescobio;873
Asturias;Asturias;Somiedo;1435
Asturias;Asturias;Soto del Barco;4052
Asturias;Asturias;Tapia de Casariego;4186
Asturias;Asturias;Taramundi;739
Asturias;Asturias;Teverga;1933
Asturias;Asturias;Tineo;11146
Asturias;Asturias;Valdés;13529
Asturias;Asturias;Vegadeo;4240
Asturias;Asturias;Villanueva de Oscos;382
Asturias;Asturias;Villaviciosa;14775
Asturias;Asturias;Villayón;1582
Asturias;Asturias;Yernes y Tameza;185
Canarias;Las Palmas;Agaete;5782
Canarias;Las Palmas;Agüimes;28924
Canarias;Las Palmas;Aldea de San Nicolás (La);8539
Canarias;Las Palmas;Antigua;10371
Canarias;Las Palmas;Arrecife;59127
Canarias;Las Palmas;Artenara;1257
Canarias;Las Palmas;Arucas;36259
Canarias;Las Palmas;Betancuria;680
Canarias;Las Palmas;Firgas;7524
Canarias;Las Palmas;Gáldar;24405
Canarias;Las Palmas;Haría;5249
Canarias;Las Palmas;Ingenio;29319
Canarias;Las Palmas;Mogán;21690
Canarias;Las Palmas;Moya;8054
Canarias;Las Palmas;Oliva (La);21996
Canarias;Las Palmas;Pájara;20821
Canarias;Las Palmas;Palmas de Gran Canaria (Las);381847
Canarias;Las Palmas;Puerto del Rosario;35667
Canarias;Las Palmas;San Bartolomé;18517
Canarias;Las Palmas;San Bartolomé de Tirajana;52161
Canarias;Las Palmas;Santa Brígida;19154
Canarias;Las Palmas;Santa Lucía de Tirajana;63637
Canarias;Las Palmas;Santa María de Guía de Gran Canaria;14069
Canarias;Las Palmas;Teguise;19418
Canarias;Las Palmas;Tejeda;2164
Canarias;Las Palmas;Telde;100015
Canarias;Las Palmas;Teror;12926
Canarias;Las Palmas;Tías;19849
Canarias;Las Palmas;Tinajo;5837
Canarias;Las Palmas;Tuineje;13632
Canarias;Las Palmas;Valleseco;3968
Canarias;Las Palmas;Valsequillo de Gran Canaria;9067
Canarias;Las Palmas;Vega de San Mateo;7636
Canarias;Las Palmas;Yaiza;13941
Canarias;Santa Cruz de Tenerife;Adeje;43204
Canarias;Santa Cruz de Tenerife;Agulo;1200
Canarias;Santa Cruz de Tenerife;Alajeró;2110
Canarias;Santa Cruz de Tenerife;Arafo;5502
Canarias;Santa Cruz de Tenerife;Arico;7850
Canarias;Santa Cruz de Tenerife;Arona;78614
Canarias;Santa Cruz de Tenerife;Barlovento;2363
Canarias;Santa Cruz de Tenerife;Breña Alta;7337
Canarias;Santa Cruz de Tenerife;Breña Baja;5115
Canarias;Santa Cruz de Tenerife;Buenavista del Norte;5194
Canarias;Santa Cruz de Tenerife;Candelaria;24319
Canarias;Santa Cruz de Tenerife;Fasnia;2774
Canarias;Santa Cruz de Tenerife;Frontera;4009
Canarias;Santa Cruz de Tenerife;Fuencaliente de la Palma;1935
Canarias;Santa Cruz de Tenerife;Garachico;5416
Canarias;Santa Cruz de Tenerife;Garafía;1804
Canarias;Santa Cruz de Tenerife;Granadilla de Abona;39993
Canarias;Santa Cruz de Tenerife;Guancha (La);5487
Canarias;Santa Cruz de Tenerife;Guía de Isora;20536
Canarias;Santa Cruz de Tenerife;Güímar;17662
Canarias;Santa Cruz de Tenerife;Hermigua;2203
Canarias;Santa Cruz de Tenerife;Icod de los Vinos;24024
Canarias;Santa Cruz de Tenerife;Llanos de Aridane (Los);20766
Canarias;Santa Cruz de Tenerife;Matanza de Acentejo (La);8369
Canarias;Santa Cruz de Tenerife;Orotava (La);41171
Canarias;Santa Cruz de Tenerife;Paso (El);7815
Canarias;Santa Cruz de Tenerife;Pinar de El Hierro (El);1888
Canarias;Santa Cruz de Tenerife;Puerto de la Cruz;32219
Canarias;Santa Cruz de Tenerife;Puntagorda;2108
Canarias;Santa Cruz de Tenerife;Puntallana;2460
Canarias;Santa Cruz de Tenerife;Realejos (Los);37559
Canarias;Santa Cruz de Tenerife;Rosario (El);17182
Canarias;Santa Cruz de Tenerife;San Andrés y Sauces;4884
Canarias;Santa Cruz de Tenerife;San Cristóbal de La Laguna;150661
Canarias;Santa Cruz de Tenerife;San Juan de la Rambla;5068
Canarias;Santa Cruz de Tenerife;San Miguel de Abona;16179
Canarias;Santa Cruz de Tenerife;San Sebastián de la Gomera;8965
Canarias;Santa Cruz de Tenerife;Santa Cruz de la Palma;17084
Canarias;Santa Cruz de Tenerife;Santa Cruz de Tenerife;222417
Canarias;Santa Cruz de Tenerife;Santa Úrsula;14013
Canarias;Santa Cruz de Tenerife;Santiago del Teide;12050
Canarias;Santa Cruz de Tenerife;Sauzal (El);8996
Canarias;Santa Cruz de Tenerife;Silos (Los);5254
Canarias;Santa Cruz de Tenerife;Tacoronte;23562
Canarias;Santa Cruz de Tenerife;Tanque (El);3015
Canarias;Santa Cruz de Tenerife;Tazacorte;5755
Canarias;Santa Cruz de Tenerife;Tegueste;10666
Canarias;Santa Cruz de Tenerife;Tijarafe;2768
Canarias;Santa Cruz de Tenerife;Valle Gran Rey;5129
Canarias;Santa Cruz de Tenerife;Vallehermoso;3162
Canarias;Santa Cruz de Tenerife;Valverde;4995
Canarias;Santa Cruz de Tenerife;Victoria de Acentejo (La);9023
Canarias;Santa Cruz de Tenerife;Vilaflor;1854
Canarias;Santa Cruz de Tenerife;Villa de Mazo;4802
Cantabria;Cantabria;Alfoz de Lloredo;2496
Cantabria;Cantabria;Ampuero;4179
Cantabria;Cantabria;Anievas;366
Cantabria;Cantabria;Arenas de Iguña;1837
Cantabria;Cantabria;Argoños;1650
Cantabria;Cantabria;Arnuero;2122
Cantabria;Cantabria;Arredondo;525
Cantabria;Cantabria;Astillero (El);17360
Cantabria;Cantabria;Bárcena de Cicero;3784
Cantabria;Cantabria;Bárcena de Pie de Concha;805
Cantabria;Cantabria;Bareyo;2060
Cantabria;Cantabria;Cabezón de la Sal;8372
Cantabria;Cantabria;Cabezón de Liébana;699
Cantabria;Cantabria;Cabuérniga;1093
Cantabria;Cantabria;Camaleño;1075
Cantabria;Cantabria;Camargo;31404
Cantabria;Cantabria;Campoo de Enmedio;3811
Cantabria;Cantabria;Campoo de Yuso;705
Cantabria;Cantabria;Cartes;5118
Cantabria;Cantabria;Castañeda;2121
Cantabria;Cantabria;Castro-Urdiales;31670
Cantabria;Cantabria;Cieza;614
Cantabria;Cantabria;Cillorigo de Liébana;1305
Cantabria;Cantabria;Colindres;7826
Cantabria;Cantabria;Comillas;2464
Cantabria;Cantabria;Corrales de Buelna (Los);11610
Cantabria;Cantabria;Corvera de Toranzo;2208
Cantabria;Cantabria;Entrambasaguas;3961
Cantabria;Cantabria;Escalante;763
Cantabria;Cantabria;Guriezo;2303
Cantabria;Cantabria;Hazas de Cesto;1420
Cantabria;Cantabria;Hermandad de Campoo de Suso;1855
Cantabria;Cantabria;Herrerías;652
Cantabria;Cantabria;Lamasón;318
Cantabria;Cantabria;Laredo;12591
Cantabria;Cantabria;Liendo;1193
Cantabria;Cantabria;Liérganes;2467
Cantabria;Cantabria;Limpias;1741
Cantabria;Cantabria;Luena;722
Cantabria;Cantabria;Marina de Cudeyo;5252
Cantabria;Cantabria;Mazcuerras;2087
Cantabria;Cantabria;Medio Cudeyo;7565
Cantabria;Cantabria;Meruelo;1652
Cantabria;Cantabria;Miengo;4495
Cantabria;Cantabria;Miera;462
Cantabria;Cantabria;Molledo;1679
Cantabria;Cantabria;Noja;2635
Cantabria;Cantabria;Penagos;1803
Cantabria;Cantabria;Peñarrubia;367
Cantabria;Cantabria;Pesaguero;349
Cantabria;Cantabria;Pesquera;64
Cantabria;Cantabria;Piélagos;20081
Cantabria;Cantabria;Polaciones;252
Cantabria;Cantabria;Polanco;4764
Cantabria;Cantabria;Potes;1533
Cantabria;Cantabria;Puente Viesgo;2746
Cantabria;Cantabria;Ramales de la Victoria;2575
Cantabria;Cantabria;Rasines;1055
Cantabria;Cantabria;Reinosa;10307
Cantabria;Cantabria;Reocín;8196
Cantabria;Cantabria;Ribamontán al Mar;4408
Cantabria;Cantabria;Ribamontán al Monte;2117
Cantabria;Cantabria;Rionansa;1131
Cantabria;Cantabria;Riotuerto;1627
Cantabria;Cantabria;Rozas de Valdearroyo (Las);283
Cantabria;Cantabria;Ruente;1022
Cantabria;Cantabria;Ruesga;1060
Cantabria;Cantabria;Ruiloba;773
Cantabria;Cantabria;San Felices de Buelna;2314
Cantabria;Cantabria;San Miguel de Aguayo;157
Cantabria;Cantabria;San Pedro del Romeral;547
Cantabria;Cantabria;San Roque de Riomiera;446
Cantabria;Cantabria;San Vicente de la Barquera;4546
Cantabria;Cantabria;Santa Cruz de Bezana;11279
Cantabria;Cantabria;Santa María de Cayón;8526
Cantabria;Cantabria;Santander;182700
Cantabria;Cantabria;Santillana del Mar;4021
Cantabria;Cantabria;Santiurde de Reinosa;301
Cantabria;Cantabria;Santiurde de Toranzo;1512
Cantabria;Cantabria;Santoña;11569
Cantabria;Cantabria;Saro;520
Cantabria;Cantabria;Selaya;2044
Cantabria;Cantabria;Soba;1385
Cantabria;Cantabria;Solórzano;1053
Cantabria;Cantabria;Suances;8229
Cantabria;Cantabria;Tojos (Los);442
Cantabria;Cantabria;Torrelavega;55947
Cantabria;Cantabria;Tresviso;80
Cantabria;Cantabria;Tudanca;196
Cantabria;Cantabria;Udías;855
Cantabria;Cantabria;Val de San Vicente;2784
Cantabria;Cantabria;Valdáliga;2306
Cantabria;Cantabria;Valdeolea;1216
Cantabria;Cantabria;Valdeprado del Río;310
Cantabria;Cantabria;Valderredible;1099
Cantabria;Cantabria;Valle de Villaverde;375
Cantabria;Cantabria;Vega de Liébana;871
Cantabria;Cantabria;Vega de Pas;881
Cantabria;Cantabria;Villacarriedo;1765
Cantabria;Cantabria;Villaescusa;3581
Cantabria;Cantabria;Villafufre;1109
Cantabria;Cantabria;Voto;2664
Castilla La Mancha;Albacete;Abengibre;930
Castilla La Mancha;Albacete;Alatoz;591
Castilla La Mancha;Albacete;Albacete;169716
Castilla La Mancha;Albacete;Albatana;810
Castilla La Mancha;Albacete;Alborea;870
Castilla La Mancha;Albacete;Alcadozo;727
Castilla La Mancha;Albacete;Alcalá del Júcar;1361
Castilla La Mancha;Albacete;Alcaraz;1664
Castilla La Mancha;Albacete;Almansa;25727
Castilla La Mancha;Albacete;Alpera;2409
Castilla La Mancha;Albacete;Ayna;827
Castilla La Mancha;Albacete;Balazote;2453
Castilla La Mancha;Albacete;Ballestero (El);481
Castilla La Mancha;Albacete;Balsa de Ves;226
Castilla La Mancha;Albacete;Barrax;2049
Castilla La Mancha;Albacete;Bienservida;742
Castilla La Mancha;Albacete;Bogarra;1021
Castilla La Mancha;Albacete;Bonete;1231
Castilla La Mancha;Albacete;Bonillo (El);3069
Castilla La Mancha;Albacete;Carcelén;643
Castilla La Mancha;Albacete;Casas-Ibáñez;4724
Castilla La Mancha;Albacete;Casas de Juan Núñez;1420
Castilla La Mancha;Albacete;Casas de Lázaro;451
Castilla La Mancha;Albacete;Casas de Ves;774
Castilla La Mancha;Albacete;Caudete;10330
Castilla La Mancha;Albacete;Cenizate;1330
Castilla La Mancha;Albacete;Chinchilla de Monte-Aragón;3803
Castilla La Mancha;Albacete;Corral-Rubio;413
Castilla La Mancha;Albacete;Cotillas;161
Castilla La Mancha;Albacete;Elche de la Sierra;3962
Castilla La Mancha;Albacete;Férez;724
Castilla La Mancha;Albacete;Fuensanta;355
Castilla La Mancha;Albacete;Fuente-Álamo;2716
Castilla La Mancha;Albacete;Fuentealbilla;2071
Castilla La Mancha;Albacete;Gineta (La);2418
Castilla La Mancha;Albacete;Golosalvo;124
Castilla La Mancha;Albacete;Hellín;30976
Castilla La Mancha;Albacete;Herrera (La);350
Castilla La Mancha;Albacete;Higueruela;1263
Castilla La Mancha;Albacete;Hoya-Gonzalo;741
Castilla La Mancha;Albacete;Jorquera;477
Castilla La Mancha;Albacete;Letur;1122
Castilla La Mancha;Albacete;Lezuza;1650
Castilla La Mancha;Albacete;Liétor;1445
Castilla La Mancha;Albacete;Madrigueras;4938
Castilla La Mancha;Albacete;Mahora;1422
Castilla La Mancha;Albacete;Masegoso;95
Castilla La Mancha;Albacete;Minaya;1775
Castilla La Mancha;Albacete;Molinicos;1091
Castilla La Mancha;Albacete;Montalvos;134
Castilla La Mancha;Albacete;Montealegre del Castillo;2305
Castilla La Mancha;Albacete;Motilleja;585
Castilla La Mancha;Albacete;Munera;3843
Castilla La Mancha;Albacete;Navas de Jorquera;556
Castilla La Mancha;Albacete;Nerpio;1538
Castilla La Mancha;Albacete;Ontur;2349
Castilla La Mancha;Albacete;Ossa de Montiel;2706
Castilla La Mancha;Albacete;Paterna del Madera;473
Castilla La Mancha;Albacete;Peñas de San Pedro;1291
Castilla La Mancha;Albacete;Peñascosa;399
Castilla La Mancha;Albacete;Pétrola;839
Castilla La Mancha;Albacete;Povedilla;571
Castilla La Mancha;Albacete;Pozo-Lorente;478
Castilla La Mancha;Albacete;Pozo Cañada;2895
Castilla La Mancha;Albacete;Pozohondo;1800
Castilla La Mancha;Albacete;Pozuelo;618
Castilla La Mancha;Albacete;Recueja (La);320
Castilla La Mancha;Albacete;Riópar;1507
Castilla La Mancha;Albacete;Robledo;469
Castilla La Mancha;Albacete;Roda (La);16060
Castilla La Mancha;Albacete;Salobre;620
Castilla La Mancha;Albacete;San Pedro;1278
Castilla La Mancha;Albacete;Socovos;2015
Castilla La Mancha;Albacete;Tarazona de la Mancha;6755
Castilla La Mancha;Albacete;Tobarra;8029
Castilla La Mancha;Albacete;Valdeganga;1953
Castilla La Mancha;Albacete;Vianos;433
Castilla La Mancha;Albacete;Villa de Ves;60
Castilla La Mancha;Albacete;Villalgordo del Júcar;1294
Castilla La Mancha;Albacete;Villamalea;4078
Castilla La Mancha;Albacete;Villapalacios;693
Castilla La Mancha;Albacete;Villarrobledo;26642
Castilla La Mancha;Albacete;Villatoya;143
Castilla La Mancha;Albacete;Villavaliente;278
Castilla La Mancha;Albacete;Villaverde de Guadalimar;424
Castilla La Mancha;Albacete;Viveros;395
Castilla La Mancha;Albacete;Yeste;3397
Castilla La Mancha;Ciudad Real;Abenójar;1592
Castilla La Mancha;Ciudad Real;Agudo;1871
Castilla La Mancha;Ciudad Real;Alamillo;554
Castilla La Mancha;Ciudad Real;Albaladejo;1510
Castilla La Mancha;Ciudad Real;Alcázar de San Juan;30675
Castilla La Mancha;Ciudad Real;Alcoba;714
Castilla La Mancha;Ciudad Real;Alcolea de Calatrava;1636
Castilla La Mancha;Ciudad Real;Alcubillas;592
Castilla La Mancha;Ciudad Real;Aldea del Rey;2017
Castilla La Mancha;Ciudad Real;Alhambra;1140
Castilla La Mancha;Ciudad Real;Almadén;6243
Castilla La Mancha;Ciudad Real;Almadenejos;481
Castilla La Mancha;Ciudad Real;Almagro;8672
Castilla La Mancha;Ciudad Real;Almedina;699
Castilla La Mancha;Ciudad Real;Almodóvar del Campo;6820
Castilla La Mancha;Ciudad Real;Almuradiel;914
Castilla La Mancha;Ciudad Real;Anchuras;373
Castilla La Mancha;Ciudad Real;Arenales de San Gregorio;720
Castilla La Mancha;Ciudad Real;Arenas de San Juan;1050
Castilla La Mancha;Ciudad Real;Argamasilla de Alba;7391
Castilla La Mancha;Ciudad Real;Argamasilla de Calatrava;5875
Castilla La Mancha;Ciudad Real;Arroba de los Montes;543
Castilla La Mancha;Ciudad Real;Ballesteros de Calatrava;506
Castilla La Mancha;Ciudad Real;Bolaños de Calatrava;12490
Castilla La Mancha;Ciudad Real;Brazatortas;1143
Castilla La Mancha;Ciudad Real;Cabezarados;341
Castilla La Mancha;Ciudad Real;Cabezarrubias del Puerto;574
Castilla La Mancha;Ciudad Real;Calzada de Calatrava;4471
Castilla La Mancha;Ciudad Real;Campo de Criptana;15006
Castilla La Mancha;Ciudad Real;Cañada de Calatrava;114
Castilla La Mancha;Ciudad Real;Caracuel de Calatrava;166
Castilla La Mancha;Ciudad Real;Carrión de Calatrava;2931
Castilla La Mancha;Ciudad Real;Carrizosa;1472
Castilla La Mancha;Ciudad Real;Castellar de Santiago;2213
Castilla La Mancha;Ciudad Real;Chillón;2071
Castilla La Mancha;Ciudad Real;Ciudad Real;74014
Castilla La Mancha;Ciudad Real;Corral de Calatrava;1257
Castilla La Mancha;Ciudad Real;Cortijos (Los);986
Castilla La Mancha;Ciudad Real;Cózar;1243
Castilla La Mancha;Ciudad Real;Daimiel;18527
Castilla La Mancha;Ciudad Real;Fernán Caballero;1146
Castilla La Mancha;Ciudad Real;Fontanarejo;298
Castilla La Mancha;Ciudad Real;Fuencaliente;1145
Castilla La Mancha;Ciudad Real;Fuenllana;305
Castilla La Mancha;Ciudad Real;Fuente el Fresno;3631
Castilla La Mancha;Ciudad Real;Granátula de Calatrava;941
Castilla La Mancha;Ciudad Real;Guadalmez;884
Castilla La Mancha;Ciudad Real;Herencia;9123
Castilla La Mancha;Ciudad Real;Hinojosas de Calatrava;595
Castilla La Mancha;Ciudad Real;Horcajo de los Montes;972
Castilla La Mancha;Ciudad Real;Labores (Las);659
Castilla La Mancha;Ciudad Real;Llanos del Caudillo;713
Castilla La Mancha;Ciudad Real;Luciana;413
Castilla La Mancha;Ciudad Real;Malagón;8756
Castilla La Mancha;Ciudad Real;Manzanares;19186
Castilla La Mancha;Ciudad Real;Membrilla;6417
Castilla La Mancha;Ciudad Real;Mestanza;808
Castilla La Mancha;Ciudad Real;Miguelturra;13986
Castilla La Mancha;Ciudad Real;Montiel;1593
Castilla La Mancha;Ciudad Real;Moral de Calatrava;5693
Castilla La Mancha;Ciudad Real;Navalpino;267
Castilla La Mancha;Ciudad Real;Navas de Estena;379
Castilla La Mancha;Ciudad Real;Pedro Muñoz;8711
Castilla La Mancha;Ciudad Real;Picón;697
Castilla La Mancha;Ciudad Real;Piedrabuena;4817
Castilla La Mancha;Ciudad Real;Poblete;1705
Castilla La Mancha;Ciudad Real;Porzuna;4104
Castilla La Mancha;Ciudad Real;Pozuelo de Calatrava;2955
Castilla La Mancha;Ciudad Real;Pozuelos de Calatrava (Los);460
Castilla La Mancha;Ciudad Real;Puebla de Don Rodrigo;1268
Castilla La Mancha;Ciudad Real;Puebla del Príncipe;875
Castilla La Mancha;Ciudad Real;Puerto Lápice;1052
Castilla La Mancha;Ciudad Real;Puertollano;51842
Castilla La Mancha;Ciudad Real;Retuerta del Bullaque;1175
Castilla La Mancha;Ciudad Real;Robledo (El);1309
Castilla La Mancha;Ciudad Real;Ruidera;614
Castilla La Mancha;Ciudad Real;Saceruela;653
Castilla La Mancha;Ciudad Real;San Carlos del Valle;1211
Castilla La Mancha;Ciudad Real;San Lorenzo de Calatrava;273
Castilla La Mancha;Ciudad Real;Santa Cruz de los Cáñamos;602
Castilla La Mancha;Ciudad Real;Santa Cruz de Mudela;4682
Castilla La Mancha;Ciudad Real;Socuéllamos;13163
Castilla La Mancha;Ciudad Real;Solana (La);16511
Castilla La Mancha;Ciudad Real;Solana del Pino;408
Castilla La Mancha;Ciudad Real;Terrinches;922
Castilla La Mancha;Ciudad Real;Tomelloso;38095
Castilla La Mancha;Ciudad Real;Torralba de Calatrava;3061
Castilla La Mancha;Ciudad Real;Torre de Juan Abad;1259
Castilla La Mancha;Ciudad Real;Torrenueva;2949
Castilla La Mancha;Ciudad Real;Valdemanco del Esteras;247
Castilla La Mancha;Ciudad Real;Valdepeñas;31147
Castilla La Mancha;Ciudad Real;Valenzuela de Calatrava;790
Castilla La Mancha;Ciudad Real;Villahermosa;2225
Castilla La Mancha;Ciudad Real;Villamanrique;1423
Castilla La Mancha;Ciudad Real;Villamayor de Calatrava;626
Castilla La Mancha;Ciudad Real;Villanueva de la Fuente;2512
Castilla La Mancha;Ciudad Real;Villanueva de los Infantes;5806
Castilla La Mancha;Ciudad Real;Villanueva de San Carlos;382
Castilla La Mancha;Ciudad Real;Villar del Pozo;108
Castilla La Mancha;Ciudad Real;Villarrubia de los Ojos;11191
Castilla La Mancha;Ciudad Real;Villarta de San Juan;3115
Castilla La Mancha;Ciudad Real;Viso del Marqués;2811
Castilla La Mancha;Cuenca;Abia de la Obispalía;80
Castilla La Mancha;Cuenca;Acebrón (El);282
Castilla La Mancha;Cuenca;Alarcón;191
Castilla La Mancha;Cuenca;Albaladejo del Cuende;350
Castilla La Mancha;Cuenca;Albalate de las Nogueras;296
Castilla La Mancha;Cuenca;Albendea;161
Castilla La Mancha;Cuenca;Alberca de Záncara (La);1948
Castilla La Mancha;Cuenca;Alcalá de la Vega;151
Castilla La Mancha;Cuenca;Alcantud;90
Castilla La Mancha;Cuenca;Alcázar del Rey;217
Castilla La Mancha;Cuenca;Alcohujate;30
Castilla La Mancha;Cuenca;Alconchel de la Estrella;135
Castilla La Mancha;Cuenca;Algarra;26
Castilla La Mancha;Cuenca;Aliaguilla;791
Castilla La Mancha;Cuenca;Almarcha (La);547
Castilla La Mancha;Cuenca;Almendros;275
Castilla La Mancha;Cuenca;Almodóvar del Pinar;457
Castilla La Mancha;Cuenca;Almonacid del Marquesado;489
Castilla La Mancha;Cuenca;Altarejos;265
Castilla La Mancha;Cuenca;Arandilla del Arroyo;28
Castilla La Mancha;Cuenca;Arcas del Villar;1266
Castilla La Mancha;Cuenca;Arcos de la Sierra;106
Castilla La Mancha;Cuenca;Arguisuelas;159
Castilla La Mancha;Cuenca;Arrancacepas;40
Castilla La Mancha;Cuenca;Atalaya del Cañavate;110
Castilla La Mancha;Cuenca;Barajas de Melo;1026
Castilla La Mancha;Cuenca;Barchín del Hoyo;93
Castilla La Mancha;Cuenca;Bascuñana de San Pedro;27
Castilla La Mancha;Cuenca;Beamud;73
Castilla La Mancha;Cuenca;Belinchón;366
Castilla La Mancha;Cuenca;Belmonte;2251
Castilla La Mancha;Cuenca;Belmontejo;211
Castilla La Mancha;Cuenca;Beteta;357
Castilla La Mancha;Cuenca;Boniches;156
Castilla La Mancha;Cuenca;Buciegas;54
Castilla La Mancha;Cuenca;Buenache de Alarcón;657
Castilla La Mancha;Cuenca;Buenache de la Sierra;116
Castilla La Mancha;Cuenca;Buendía;484
Castilla La Mancha;Cuenca;Campillo de Altobuey;1668
Castilla La Mancha;Cuenca;Campillos-Paravientos;127
Castilla La Mancha;Cuenca;Campillos-Sierra;58
Castilla La Mancha;Cuenca;Campos del Paraíso;922
Castilla La Mancha;Cuenca;Cañada del Hoyo;312
Castilla La Mancha;Cuenca;Cañada Juncosa;306
Castilla La Mancha;Cuenca;Canalejas del Arroyo;340
Castilla La Mancha;Cuenca;Cañamares;534
Castilla La Mancha;Cuenca;Cañavate (El);168
Castilla La Mancha;Cuenca;Cañaveras;371
Castilla La Mancha;Cuenca;Cañaveruelas;186
Castilla La Mancha;Cuenca;Cañete;947
Castilla La Mancha;Cuenca;Cañizares;559
Castilla La Mancha;Cuenca;Carboneras de Guadazaón;859
Castilla La Mancha;Cuenca;Cardenete;623
Castilla La Mancha;Cuenca;Carrascosa;109
Castilla La Mancha;Cuenca;Carrascosa de Haro;130
Castilla La Mancha;Cuenca;Casas de Benítez;1052
Castilla La Mancha;Cuenca;Casas de Fernando Alonso;1462
Castilla La Mancha;Cuenca;Casas de Garcimolina;31
Castilla La Mancha;Cuenca;Casas de Guijarro;153
Castilla La Mancha;Cuenca;Casas de Haro;905
Castilla La Mancha;Cuenca;Casas de los Pinos;537
Castilla La Mancha;Cuenca;Casasimarro;3347
Castilla La Mancha;Cuenca;Castejón;211
Castilla La Mancha;Cuenca;Castillejo-Sierra;38
Castilla La Mancha;Cuenca;Castillejo de Iniesta;176
Castilla La Mancha;Cuenca;Castillo-Albaráñez;22
Castilla La Mancha;Cuenca;Castillo de Garcimuñoz;171
Castilla La Mancha;Cuenca;Cervera del Llano;277
Castilla La Mancha;Cuenca;Chillarón de Cuenca;401
Castilla La Mancha;Cuenca;Chumillas;67
Castilla La Mancha;Cuenca;Cierva (La);53
Castilla La Mancha;Cuenca;Cuenca;55866
Castilla La Mancha;Cuenca;Cueva del Hierro;41
Castilla La Mancha;Cuenca;Enguídanos;415
Castilla La Mancha;Cuenca;Fresneda de Altarejos;72
Castilla La Mancha;Cuenca;Fresneda de la Sierra;59
Castilla La Mancha;Cuenca;Frontera (La);178
Castilla La Mancha;Cuenca;Fuente de Pedro Naharro;1316
Castilla La Mancha;Cuenca;Fuentelespino de Haro;293
Castilla La Mancha;Cuenca;Fuentelespino de Moya;153
Castilla La Mancha;Cuenca;Fuentenava de Jábaga;534
Castilla La Mancha;Cuenca;Fuentes;508
Castilla La Mancha;Cuenca;Fuertescusa;93
Castilla La Mancha;Cuenca;Gabaldón;198
Castilla La Mancha;Cuenca;Garaballa;117
Castilla La Mancha;Cuenca;Gascueña;191
Castilla La Mancha;Cuenca;Graja de Campalbo;113
Castilla La Mancha;Cuenca;Graja de Iniesta;436
Castilla La Mancha;Cuenca;Henarejos;206
Castilla La Mancha;Cuenca;Herrumblar (El);745
Castilla La Mancha;Cuenca;Hinojosa (La);270
Castilla La Mancha;Cuenca;Hinojosos (Los);1010
Castilla La Mancha;Cuenca;Hito (El);184
Castilla La Mancha;Cuenca;Honrubia;1780
Castilla La Mancha;Cuenca;Hontanaya;371
Castilla La Mancha;Cuenca;Hontecillas;82
Castilla La Mancha;Cuenca;Horcajo de Santiago;4268
Castilla La Mancha;Cuenca;Huélamo;116
Castilla La Mancha;Cuenca;Huelves;78
Castilla La Mancha;Cuenca;Huérguina;68
Castilla La Mancha;Cuenca;Huerta de la Obispalía;124
Castilla La Mancha;Cuenca;Huerta del Marquesado;213
Castilla La Mancha;Cuenca;Huete;2025
Castilla La Mancha;Cuenca;Iniesta;4685
Castilla La Mancha;Cuenca;Laguna del Marquesado;56
Castilla La Mancha;Cuenca;Lagunaseca;95
Castilla La Mancha;Cuenca;Landete;1374
Castilla La Mancha;Cuenca;Ledaña;1926
Castilla La Mancha;Cuenca;Leganiel;233
Castilla La Mancha;Cuenca;Majadas (Las);327
Castilla La Mancha;Cuenca;Mariana;293
Castilla La Mancha;Cuenca;Masegosa;109
Castilla La Mancha;Cuenca;Mesas (Las);2533
Castilla La Mancha;Cuenca;Minglanilla;2742
Castilla La Mancha;Cuenca;Mira;874
Castilla La Mancha;Cuenca;Monreal del Llano;84
Castilla La Mancha;Cuenca;Montalbanejo;141
Castilla La Mancha;Cuenca;Montalbo;788
Castilla La Mancha;Cuenca;Monteagudo de las Salinas;136
Castilla La Mancha;Cuenca;Mota de Altarejos;46
Castilla La Mancha;Cuenca;Mota del Cuervo;6307
Castilla La Mancha;Cuenca;Motilla del Palancar;6167
Castilla La Mancha;Cuenca;Moya;214
Castilla La Mancha;Cuenca;Narboneta;67
Castilla La Mancha;Cuenca;Olivares de Júcar;414
Castilla La Mancha;Cuenca;Olmeda de la Cuesta;32
Castilla La Mancha;Cuenca;Olmeda del Rey;180
Castilla La Mancha;Cuenca;Olmedilla de Alarcón;152
Castilla La Mancha;Cuenca;Olmedilla de Eliz;23
Castilla La Mancha;Cuenca;Osa de la Vega;627
Castilla La Mancha;Cuenca;Pajarón;101
Castilla La Mancha;Cuenca;Pajaroncillo;75
Castilla La Mancha;Cuenca;Palomares del Campo;802
Castilla La Mancha;Cuenca;Palomera;187
Castilla La Mancha;Cuenca;Paracuellos;133
Castilla La Mancha;Cuenca;Paredes;99
Castilla La Mancha;Cuenca;Parra de las Vegas (La);41
Castilla La Mancha;Cuenca;Pedernoso (El);1261
Castilla La Mancha;Cuenca;Pedroñeras (Las);7221
Castilla La Mancha;Cuenca;Peral (El);806
Castilla La Mancha;Cuenca;Peraleja (La);134
Castilla La Mancha;Cuenca;Pesquera (La);251
Castilla La Mancha;Cuenca;Picazo (El);790
Castilla La Mancha;Cuenca;Pinarejo;319
Castilla La Mancha;Cuenca;Pineda de Gigüela;89
Castilla La Mancha;Cuenca;Piqueras del Castillo;68
Castilla La Mancha;Cuenca;Portalrubio de Guadamejud;44
Castilla La Mancha;Cuenca;Portilla;82
Castilla La Mancha;Cuenca;Poyatos;100
Castilla La Mancha;Cuenca;Pozoamargo;372
Castilla La Mancha;Cuenca;Pozorrubielos de la Mancha;361
Castilla La Mancha;Cuenca;Pozorrubio;394
Castilla La Mancha;Cuenca;Pozuelo (El);92
Castilla La Mancha;Cuenca;Priego;1138
Castilla La Mancha;Cuenca;Provencio (El);2794
Castilla La Mancha;Cuenca;Puebla de Almenara;474
Castilla La Mancha;Cuenca;Puebla de Don Francisco;322
Castilla La Mancha;Cuenca;Puebla del Salvador;257
Castilla La Mancha;Cuenca;Quintanar del Rey;7892
Castilla La Mancha;Cuenca;Rada de Haro;62
Castilla La Mancha;Cuenca;Reíllo;125
Castilla La Mancha;Cuenca;Rozalén del Monte;76
Castilla La Mancha;Cuenca;Saceda-Trasierra;86
Castilla La Mancha;Cuenca;Saelices;650
Castilla La Mancha;Cuenca;Salinas del Manzano;101
Castilla La Mancha;Cuenca;Salmeroncillos;168
Castilla La Mancha;Cuenca;Salvacañete;324
Castilla La Mancha;Cuenca;San Clemente;7093
Castilla La Mancha;Cuenca;San Lorenzo de la Parrilla;1297
Castilla La Mancha;Cuenca;San Martín de Boniches;68
Castilla La Mancha;Cuenca;San Pedro Palmiches;96
Castilla La Mancha;Cuenca;Santa Cruz de Moya;290
Castilla La Mancha;Cuenca;Santa María de los Llanos;746
Castilla La Mancha;Cuenca;Santa María del Campo Rus;718
Castilla La Mancha;Cuenca;Santa María del Val;89
Castilla La Mancha;Cuenca;Sisante;1958
Castilla La Mancha;Cuenca;Solera de Gabaldón;34
Castilla La Mancha;Cuenca;Sotorribas;863
Castilla La Mancha;Cuenca;Talayuelas;1048
Castilla La Mancha;Cuenca;Tarancón;15651
Castilla La Mancha;Cuenca;Tébar;381
Castilla La Mancha;Cuenca;Tejadillos;140
Castilla La Mancha;Cuenca;Tinajas;344
Castilla La Mancha;Cuenca;Torralba;165
Castilla La Mancha;Cuenca;Torrejoncillo del Rey;597
Castilla La Mancha;Cuenca;Torrubia del Campo;341
Castilla La Mancha;Cuenca;Torrubia del Castillo;40
Castilla La Mancha;Cuenca;Tragacete;354
Castilla La Mancha;Cuenca;Tresjuncos;406
Castilla La Mancha;Cuenca;Tribaldos;123
Castilla La Mancha;Cuenca;Uclés;246
Castilla La Mancha;Cuenca;Uña;117
Castilla La Mancha;Cuenca;Valdecolmenas (Los);102
Castilla La Mancha;Cuenca;Valdemeca;116
Castilla La Mancha;Cuenca;Valdemorillo de la Sierra;81
Castilla La Mancha;Cuenca;Valdemoro-Sierra;149
Castilla La Mancha;Cuenca;Valdeolivas;276
Castilla La Mancha;Cuenca;Valdetórtola;167
Castilla La Mancha;Cuenca;Valeras (Las);1584
Castilla La Mancha;Cuenca;Valhermoso de la Fuente;57
Castilla La Mancha;Cuenca;Valsalobre;64
Castilla La Mancha;Cuenca;Valverde de Júcar;1157
Castilla La Mancha;Cuenca;Valverdejo;116
Castilla La Mancha;Cuenca;Vara de Rey;632
Castilla La Mancha;Cuenca;Vega del Codorno;172
Castilla La Mancha;Cuenca;Vellisca;159
Castilla La Mancha;Cuenca;Villaconejos de Trabaque;459
Castilla La Mancha;Cuenca;Villaescusa de Haro;547
Castilla La Mancha;Cuenca;Villagarcía del Llano;868
Castilla La Mancha;Cuenca;Villalba de la Sierra;559
Castilla La Mancha;Cuenca;Villalba del Rey;611
Castilla La Mancha;Cuenca;Villalgordo del Marquesado;100
Castilla La Mancha;Cuenca;Villalpardo;1156
Castilla La Mancha;Cuenca;Villamayor de Santiago;3078
Castilla La Mancha;Cuenca;Villanueva de Guadamejud;115
Castilla La Mancha;Cuenca;Villanueva de la Jara;2030
Castilla La Mancha;Cuenca;Villar de Cañas;442
Castilla La Mancha;Cuenca;Villar de Domingo García;235
Castilla La Mancha;Cuenca;Villar de la Encina;179
Castilla La Mancha;Cuenca;Villar de Olalla;1195
Castilla La Mancha;Cuenca;Villar del Humo;298
Castilla La Mancha;Cuenca;Villar del Infantado;45
Castilla La Mancha;Cuenca;Villar y Velasco;116
Castilla La Mancha;Cuenca;Villarejo-Periesteban;450
Castilla La Mancha;Cuenca;Villarejo de Fuentes;694
Castilla La Mancha;Cuenca;Villarejo de la Peñuela;24
Castilla La Mancha;Cuenca;Villares del Saz;635
Castilla La Mancha;Cuenca;Villarrubio;249
Castilla La Mancha;Cuenca;Villarta;935
Castilla La Mancha;Cuenca;Villas de la Ventosa;300
Castilla La Mancha;Cuenca;Villaverde y Pasaconsol;380
Castilla La Mancha;Cuenca;Víllora;177
Castilla La Mancha;Cuenca;Vindel;19
Castilla La Mancha;Cuenca;Yémeda;30
Castilla La Mancha;Cuenca;Zafra de Záncara;150
Castilla La Mancha;Cuenca;Zafrilla;95
Castilla La Mancha;Cuenca;Zarza de Tajo;398
Castilla La Mancha;Cuenca;Zarzuela;235
Castilla La Mancha;Guadalajara;Abánades;83
Castilla La Mancha;Guadalajara;Ablanque;110
Castilla La Mancha;Guadalajara;Adobes;55
Castilla La Mancha;Guadalajara;Alaminos;69
Castilla La Mancha;Guadalajara;Alarilla;136
Castilla La Mancha;Guadalajara;Albalate de Zorita;1087
Castilla La Mancha;Guadalajara;Albares;547
Castilla La Mancha;Guadalajara;Albendiego;39
Castilla La Mancha;Guadalajara;Alcocer;314
Castilla La Mancha;Guadalajara;Alcolea de las Peñas;16
Castilla La Mancha;Guadalajara;Alcolea del Pinar;401
Castilla La Mancha;Guadalajara;Alcoroches;169
Castilla La Mancha;Guadalajara;Aldeanueva de Guadalajara;106
Castilla La Mancha;Guadalajara;Algar de Mesa;56
Castilla La Mancha;Guadalajara;Algora;108
Castilla La Mancha;Guadalajara;Alhóndiga;207
Castilla La Mancha;Guadalajara;Alique;27
Castilla La Mancha;Guadalajara;Almadrones;98
Castilla La Mancha;Guadalajara;Almoguera;1481
Castilla La Mancha;Guadalajara;Almonacid de Zorita;801
Castilla La Mancha;Guadalajara;Alocén;178
Castilla La Mancha;Guadalajara;Alovera;10734
Castilla La Mancha;Guadalajara;Alustante;230
Castilla La Mancha;Guadalajara;Angón;24
Castilla La Mancha;Guadalajara;Anguita;203
Castilla La Mancha;Guadalajara;Anquela del Ducado;73
Castilla La Mancha;Guadalajara;Anquela del Pedregal;22
Castilla La Mancha;Guadalajara;Aranzueque;443
Castilla La Mancha;Guadalajara;Arbancón;188
Castilla La Mancha;Guadalajara;Arbeteta;35
Castilla La Mancha;Guadalajara;Argecilla;71
Castilla La Mancha;Guadalajara;Armallones;56
Castilla La Mancha;Guadalajara;Armuña de Tajuña;251
Castilla La Mancha;Guadalajara;Arroyo de las Fraguas;38
Castilla La Mancha;Guadalajara;Atanzón;92
Castilla La Mancha;Guadalajara;Atienza;466
Castilla La Mancha;Guadalajara;Auñón;217
Castilla La Mancha;Guadalajara;Azuqueca de Henares;32744
Castilla La Mancha;Guadalajara;Baides;48
Castilla La Mancha;Guadalajara;Baños de Tajo;20
Castilla La Mancha;Guadalajara;Bañuelos;32
Castilla La Mancha;Guadalajara;Barriopedro;27
Castilla La Mancha;Guadalajara;Berninches;92
Castilla La Mancha;Guadalajara;Bodera (La);29
Castilla La Mancha;Guadalajara;Brihuega;2873
Castilla La Mancha;Guadalajara;Budia;226
Castilla La Mancha;Guadalajara;Bujalaro;69
Castilla La Mancha;Guadalajara;Bustares;89
Castilla La Mancha;Guadalajara;Cabanillas del Campo;9131
Castilla La Mancha;Guadalajara;Campillo de Dueñas;102
Castilla La Mancha;Guadalajara;Campillo de Ranas;206
Castilla La Mancha;Guadalajara;Campisábalos;70
Castilla La Mancha;Guadalajara;Cañizar;95
Castilla La Mancha;Guadalajara;Canredondo;102
Castilla La Mancha;Guadalajara;Cantalojas;152
Castilla La Mancha;Guadalajara;Cardoso de la Sierra (El);71
Castilla La Mancha;Guadalajara;Casa de Uceda;87
Castilla La Mancha;Guadalajara;Casar (El);10031
Castilla La Mancha;Guadalajara;Casas de San Galindo;33
Castilla La Mancha;Guadalajara;Caspueñas;108
Castilla La Mancha;Guadalajara;Castejón de Henares;102
Castilla La Mancha;Guadalajara;Castellar de la Muela;33
Castilla La Mancha;Guadalajara;Castilforte;54
Castilla La Mancha;Guadalajara;Castilnuevo;13
Castilla La Mancha;Guadalajara;Cendejas de Enmedio;109
Castilla La Mancha;Guadalajara;Cendejas de la Torre;45
Castilla La Mancha;Guadalajara;Centenera;115
Castilla La Mancha;Guadalajara;Checa;341
Castilla La Mancha;Guadalajara;Chequilla;19
Castilla La Mancha;Guadalajara;Chillarón del Rey;123
Castilla La Mancha;Guadalajara;Chiloeches;2772
Castilla La Mancha;Guadalajara;Cifuentes;2075
Castilla La Mancha;Guadalajara;Cincovillas;28
Castilla La Mancha;Guadalajara;Ciruelas;116
Castilla La Mancha;Guadalajara;Ciruelos del Pinar;35
Castilla La Mancha;Guadalajara;Cobeta;120
Castilla La Mancha;Guadalajara;Cogollor;34
Castilla La Mancha;Guadalajara;Cogolludo;701
Castilla La Mancha;Guadalajara;Condemios de Abajo;25
Castilla La Mancha;Guadalajara;Condemios de Arriba;169
Castilla La Mancha;Guadalajara;Congostrina;52
Castilla La Mancha;Guadalajara;Copernal;38
Castilla La Mancha;Guadalajara;Corduente;411
Castilla La Mancha;Guadalajara;Cubillo de Uceda (El);191
Castilla La Mancha;Guadalajara;Driebes;450
Castilla La Mancha;Guadalajara;Durón;122
Castilla La Mancha;Guadalajara;Embid;54
Castilla La Mancha;Guadalajara;Escamilla;91
Castilla La Mancha;Guadalajara;Escariche;204
Castilla La Mancha;Guadalajara;Escopete;84
Castilla La Mancha;Guadalajara;Espinosa de Henares;821
Castilla La Mancha;Guadalajara;Esplegares;46
Castilla La Mancha;Guadalajara;Establés;48
Castilla La Mancha;Guadalajara;Estriégana;24
Castilla La Mancha;Guadalajara;Fontanar;2012
Castilla La Mancha;Guadalajara;Fuembellida;16
Castilla La Mancha;Guadalajara;Fuencemillán;130
Castilla La Mancha;Guadalajara;Fuentelahiguera de Albatages;146
Castilla La Mancha;Guadalajara;Fuentelencina;349
Castilla La Mancha;Guadalajara;Fuentelsaz;107
Castilla La Mancha;Guadalajara;Fuentelviejo;55
Castilla La Mancha;Guadalajara;Fuentenovilla;616
Castilla La Mancha;Guadalajara;Gajanejos;63
Castilla La Mancha;Guadalajara;Galápagos;2037
Castilla La Mancha;Guadalajara;Galve de Sorbe;140
Castilla La Mancha;Guadalajara;Gascueña de Bornova;68
Castilla La Mancha;Guadalajara;Guadalajara;83039
Castilla La Mancha;Guadalajara;Henche;103
Castilla La Mancha;Guadalajara;Heras de Ayuso;241
Castilla La Mancha;Guadalajara;Herrería;21
Castilla La Mancha;Guadalajara;Hiendelaencina;154
Castilla La Mancha;Guadalajara;Hijes;26
Castilla La Mancha;Guadalajara;Hita;416
Castilla La Mancha;Guadalajara;Hombrados;32
Castilla La Mancha;Guadalajara;Hontoba;341
Castilla La Mancha;Guadalajara;Horche;2351
Castilla La Mancha;Guadalajara;Hortezuela de Océn;73
Castilla La Mancha;Guadalajara;Huerce (La);55
Castilla La Mancha;Guadalajara;Huérmeces del Cerro;45
Castilla La Mancha;Guadalajara;Huertahernando;69
Castilla La Mancha;Guadalajara;Hueva;134
Castilla La Mancha;Guadalajara;Humanes;1521
Castilla La Mancha;Guadalajara;Illana;914
Castilla La Mancha;Guadalajara;Iniéstola;17
Castilla La Mancha;Guadalajara;Inviernas (Las);89
Castilla La Mancha;Guadalajara;Irueste;63
Castilla La Mancha;Guadalajara;Jadraque;1580
Castilla La Mancha;Guadalajara;Jirueque;69
Castilla La Mancha;Guadalajara;Ledanca;99
Castilla La Mancha;Guadalajara;Loranca de Tajuña;1428
Castilla La Mancha;Guadalajara;Lupiana;237
Castilla La Mancha;Guadalajara;Luzaga;92
Castilla La Mancha;Guadalajara;Luzón;75
Castilla La Mancha;Guadalajara;Majaelrayo;66
Castilla La Mancha;Guadalajara;Málaga del Fresno;212
Castilla La Mancha;Guadalajara;Malaguilla;123
Castilla La Mancha;Guadalajara;Mandayona;397
Castilla La Mancha;Guadalajara;Mantiel;76
Castilla La Mancha;Guadalajara;Maranchón;244
Castilla La Mancha;Guadalajara;Marchamalo;5252
Castilla La Mancha;Guadalajara;Masegoso de Tajuña;85
Castilla La Mancha;Guadalajara;Matarrubia;61
Castilla La Mancha;Guadalajara;Matillas;164
Castilla La Mancha;Guadalajara;Mazarete;55
Castilla La Mancha;Guadalajara;Mazuecos;369
Castilla La Mancha;Guadalajara;Medranda;114
Castilla La Mancha;Guadalajara;Megina;57
Castilla La Mancha;Guadalajara;Membrillera;122
Castilla La Mancha;Guadalajara;Miedes de Atienza;87
Castilla La Mancha;Guadalajara;Mierla (La);27
Castilla La Mancha;Guadalajara;Millana;173
Castilla La Mancha;Guadalajara;Milmarcos;112
Castilla La Mancha;Guadalajara;Miñosa (La);46
Castilla La Mancha;Guadalajara;Mirabueno;91
Castilla La Mancha;Guadalajara;Miralrío;86
Castilla La Mancha;Guadalajara;Mochales;58
Castilla La Mancha;Guadalajara;Mohernando;207
Castilla La Mancha;Guadalajara;Molina de Aragón;3671
Castilla La Mancha;Guadalajara;Monasterio;21
Castilla La Mancha;Guadalajara;Mondéjar;2665
Castilla La Mancha;Guadalajara;Montarrón;38
Castilla La Mancha;Guadalajara;Moratilla de los Meleros;127
Castilla La Mancha;Guadalajara;Morenilla;48
Castilla La Mancha;Guadalajara;Muduex;122
Castilla La Mancha;Guadalajara;Navas de Jadraque (Las);31
Castilla La Mancha;Guadalajara;Negredo;19
Castilla La Mancha;Guadalajara;Ocentejo;27
Castilla La Mancha;Guadalajara;Olivar (El);133
Castilla La Mancha;Guadalajara;Olmeda de Cobeta;78
Castilla La Mancha;Guadalajara;Olmeda de Jadraque (La);22
Castilla La Mancha;Guadalajara;Ordial (El);41
Castilla La Mancha;Guadalajara;Orea;249
Castilla La Mancha;Guadalajara;Pálmaces de Jadraque;74
Castilla La Mancha;Guadalajara;Pardos;59
Castilla La Mancha;Guadalajara;Paredes de Sigüenza;34
Castilla La Mancha;Guadalajara;Pareja;609
Castilla La Mancha;Guadalajara;Pastrana;1157
Castilla La Mancha;Guadalajara;Pedregal (El);90
Castilla La Mancha;Guadalajara;Peñalén;103
Castilla La Mancha;Guadalajara;Peñalver;236
Castilla La Mancha;Guadalajara;Peralejos de las Truchas;166
Castilla La Mancha;Guadalajara;Peralveche;88
Castilla La Mancha;Guadalajara;Pinilla de Jadraque;62
Castilla La Mancha;Guadalajara;Pinilla de Molina;21
Castilla La Mancha;Guadalajara;Pioz;2784
Castilla La Mancha;Guadalajara;Piqueras;53
Castilla La Mancha;Guadalajara;Pobo de Dueñas (El);163
Castilla La Mancha;Guadalajara;Poveda de la Sierra;154
Castilla La Mancha;Guadalajara;Pozo de Almoguera;128
Castilla La Mancha;Guadalajara;Pozo de Guadalajara;1314
Castilla La Mancha;Guadalajara;Prádena de Atienza;43
Castilla La Mancha;Guadalajara;Prados Redondos;98
Castilla La Mancha;Guadalajara;Puebla de Beleña;60
Castilla La Mancha;Guadalajara;Puebla de Valles;85
Castilla La Mancha;Guadalajara;Quer;638
Castilla La Mancha;Guadalajara;Rebollosa de Jadraque;25
Castilla La Mancha;Guadalajara;Recuenco (El);79
Castilla La Mancha;Guadalajara;Renera;113
Castilla La Mancha;Guadalajara;Retiendas;48
Castilla La Mancha;Guadalajara;Riba de Saelices;130
Castilla La Mancha;Guadalajara;Rillo de Gallo;67
Castilla La Mancha;Guadalajara;Riofrío del Llano;50
Castilla La Mancha;Guadalajara;Robledillo de Mohernando;143
Castilla La Mancha;Guadalajara;Robledo de Corpes;71
Castilla La Mancha;Guadalajara;Romanillos de Atienza;52
Castilla La Mancha;Guadalajara;Romanones;129
Castilla La Mancha;Guadalajara;Rueda de la Sierra;54
Castilla La Mancha;Guadalajara;Sacecorbo;125
Castilla La Mancha;Guadalajara;Sacedón;1856
Castilla La Mancha;Guadalajara;Saelices de la Sal;53
Castilla La Mancha;Guadalajara;Salmerón;194
Castilla La Mancha;Guadalajara;San Andrés del Congosto;92
Castilla La Mancha;Guadalajara;San Andrés del Rey;41
Castilla La Mancha;Guadalajara;Santiuste;21
Castilla La Mancha;Guadalajara;Saúca;54
Castilla La Mancha;Guadalajara;Sayatón;115
Castilla La Mancha;Guadalajara;Selas;75
Castilla La Mancha;Guadalajara;Semillas;44
Castilla La Mancha;Guadalajara;Setiles;119
Castilla La Mancha;Guadalajara;Sienes;76
Castilla La Mancha;Guadalajara;Sigüenza;5044
Castilla La Mancha;Guadalajara;Solanillos del Extremo;118
Castilla La Mancha;Guadalajara;Somolinos;36
Castilla La Mancha;Guadalajara;Sotillo (El);46
Castilla La Mancha;Guadalajara;Sotodosos;55
Castilla La Mancha;Guadalajara;Tamajón;189
Castilla La Mancha;Guadalajara;Taragudo;40
Castilla La Mancha;Guadalajara;Taravilla;56
Castilla La Mancha;Guadalajara;Tartanedo;148
Castilla La Mancha;Guadalajara;Tendilla;409
Castilla La Mancha;Guadalajara;Terzaga;27
Castilla La Mancha;Guadalajara;Tierzo;41
Castilla La Mancha;Guadalajara;Toba (La);107
Castilla La Mancha;Guadalajara;Tordellego;66
Castilla La Mancha;Guadalajara;Tordelrábano;10
Castilla La Mancha;Guadalajara;Tordesilos;126
Castilla La Mancha;Guadalajara;Torija;1283
Castilla La Mancha;Guadalajara;Torre del Burgo;190
Castilla La Mancha;Guadalajara;Torrecuadrada de Molina;18
Castilla La Mancha;Guadalajara;Torrecuadradilla;42
Castilla La Mancha;Guadalajara;Torrejón del Rey;4826
Castilla La Mancha;Guadalajara;Torremocha de Jadraque;24
Castilla La Mancha;Guadalajara;Torremocha del Campo;231
Castilla La Mancha;Guadalajara;Torremocha del Pinar;61
Castilla La Mancha;Guadalajara;Torremochuela;12
Castilla La Mancha;Guadalajara;Torrubia;29
Castilla La Mancha;Guadalajara;Tórtola de Henares;801
Castilla La Mancha;Guadalajara;Tortuera;222
Castilla La Mancha;Guadalajara;Tortuero;22
Castilla La Mancha;Guadalajara;Traíd;44
Castilla La Mancha;Guadalajara;Trijueque;1529
Castilla La Mancha;Guadalajara;Trillo;1381
Castilla La Mancha;Guadalajara;Uceda;2338
Castilla La Mancha;Guadalajara;Ujados;32
Castilla La Mancha;Guadalajara;Utande;50
Castilla La Mancha;Guadalajara;Valdarachas;40
Castilla La Mancha;Guadalajara;Valdearenas;95
Castilla La Mancha;Guadalajara;Valdeavellano;101
Castilla La Mancha;Guadalajara;Valdeaveruelo;1014
Castilla La Mancha;Guadalajara;Valdeconcha;47
Castilla La Mancha;Guadalajara;Valdegrudas;65
Castilla La Mancha;Guadalajara;Valdelcubo;66
Castilla La Mancha;Guadalajara;Valdenuño Fernández;286
Castilla La Mancha;Guadalajara;Valdepeñas de la Sierra;202
Castilla La Mancha;Guadalajara;Valderrebollo;56
Castilla La Mancha;Guadalajara;Valdesotos;30
Castilla La Mancha;Guadalajara;Valfermoso de Tajuña;72
Castilla La Mancha;Guadalajara;Valhermoso;39
Castilla La Mancha;Guadalajara;Valtablado del Río;14
Castilla La Mancha;Guadalajara;Valverde de los Arroyos;97
Castilla La Mancha;Guadalajara;Viana de Jadraque;36
Castilla La Mancha;Guadalajara;Villanueva de Alcorón;212
Castilla La Mancha;Guadalajara;Villanueva de Argecilla;42
Castilla La Mancha;Guadalajara;Villanueva de la Torre;6050
Castilla La Mancha;Guadalajara;Villares de Jadraque;68
Castilla La Mancha;Guadalajara;Villaseca de Henares;58
Castilla La Mancha;Guadalajara;Villaseca de Uceda;54
Castilla La Mancha;Guadalajara;Villel de Mesa;176
Castilla La Mancha;Guadalajara;Viñuelas;107
Castilla La Mancha;Guadalajara;Yebes;859
Castilla La Mancha;Guadalajara;Yebra;567
Castilla La Mancha;Guadalajara;Yélamos de Abajo;65
Castilla La Mancha;Guadalajara;Yélamos de Arriba;115
Castilla La Mancha;Guadalajara;Yunquera de Henares;3460
Castilla La Mancha;Guadalajara;Yunta (La);125
Castilla La Mancha;Guadalajara;Zaorejas;169
Castilla La Mancha;Guadalajara;Zarzuela de Jadraque;50
Castilla La Mancha;Guadalajara;Zorita de los Canes;84
Castilla La Mancha;Toledo;Ajofrín;2290
Castilla La Mancha;Toledo;Alameda de la Sagra;3385
Castilla La Mancha;Toledo;Albarreal de Tajo;718
Castilla La Mancha;Toledo;Alcabón;754
Castilla La Mancha;Toledo;Alcañizo;355
Castilla La Mancha;Toledo;Alcaudete de la Jara;2048
Castilla La Mancha;Toledo;Alcolea de Tajo;863
Castilla La Mancha;Toledo;Aldea en Cabo;226
Castilla La Mancha;Toledo;Aldeanueva de Barbarroya;663
Castilla La Mancha;Toledo;Aldeanueva de San Bartolomé;524
Castilla La Mancha;Toledo;Almendral de la Cañada;393
Castilla La Mancha;Toledo;Almonacid de Toledo;901
Castilla La Mancha;Toledo;Almorox;2410
Castilla La Mancha;Toledo;Añover de Tajo;5434
Castilla La Mancha;Toledo;Arcicóllar;786
Castilla La Mancha;Toledo;Argés;5446
Castilla La Mancha;Toledo;Azután;310
Castilla La Mancha;Toledo;Barcience;578
Castilla La Mancha;Toledo;Bargas;8987
Castilla La Mancha;Toledo;Belvís de la Jara;1852
Castilla La Mancha;Toledo;Borox;3167
Castilla La Mancha;Toledo;Buenaventura;481
Castilla La Mancha;Toledo;Burguillos de Toledo;2491
Castilla La Mancha;Toledo;Burujón;1455
Castilla La Mancha;Toledo;Cabañas de la Sagra;1922
Castilla La Mancha;Toledo;Cabañas de Yepes;290
Castilla La Mancha;Toledo;Cabezamesada;494
Castilla La Mancha;Toledo;Calera y Chozas;4552
Castilla La Mancha;Toledo;Caleruela;284
Castilla La Mancha;Toledo;Calzada de Oropesa;572
Castilla La Mancha;Toledo;Camarena;3520
Castilla La Mancha;Toledo;Camarenilla;613
Castilla La Mancha;Toledo;Campillo de la Jara (El);433
Castilla La Mancha;Toledo;Camuñas;1948
Castilla La Mancha;Toledo;Cardiel de los Montes;365
Castilla La Mancha;Toledo;Carmena;889
Castilla La Mancha;Toledo;Carpio de Tajo (El);2202
Castilla La Mancha;Toledo;Carranque;3896
Castilla La Mancha;Toledo;Carriches;313
Castilla La Mancha;Toledo;Casar de Escalona (El);2179
Castilla La Mancha;Toledo;Casarrubios del Monte;5131
Castilla La Mancha;Toledo;Casasbuenas;242
Castilla La Mancha;Toledo;Castillo de Bayuela;1065
Castilla La Mancha;Toledo;Cazalegas;1759
Castilla La Mancha;Toledo;Cebolla;3768
Castilla La Mancha;Toledo;Cedillo del Condado;2827
Castilla La Mancha;Toledo;Cerralbos (Los);514
Castilla La Mancha;Toledo;Cervera de los Montes;423
Castilla La Mancha;Toledo;Chozas de Canales;3851
Castilla La Mancha;Toledo;Chueca;252
Castilla La Mancha;Toledo;Ciruelos;685
Castilla La Mancha;Toledo;Cobeja;2387
Castilla La Mancha;Toledo;Cobisa;3766
Castilla La Mancha;Toledo;Consuegra;10932
Castilla La Mancha;Toledo;Corral de Almaguer;6257
Castilla La Mancha;Toledo;Cuerva;1584
Castilla La Mancha;Toledo;Domingo Pérez;542
Castilla La Mancha;Toledo;Dosbarrios;2497
Castilla La Mancha;Toledo;Erustes;255
Castilla La Mancha;Toledo;Escalona;3521
Castilla La Mancha;Toledo;Escalonilla;1621
Castilla La Mancha;Toledo;Espinoso del Rey;585
Castilla La Mancha;Toledo;Esquivias;5262
Castilla La Mancha;Toledo;Estrella (La);303
Castilla La Mancha;Toledo;Fuensalida;10967
Castilla La Mancha;Toledo;Gálvez;3492
Castilla La Mancha;Toledo;Garciotum;166
Castilla La Mancha;Toledo;Gerindote;2439
Castilla La Mancha;Toledo;Guadamur;1828
Castilla La Mancha;Toledo;Guardia (La);2544
Castilla La Mancha;Toledo;Herencias (Las);821
Castilla La Mancha;Toledo;Herreruela de Oropesa;447
Castilla La Mancha;Toledo;Hinojosa de San Vicente;470
Castilla La Mancha;Toledo;Hontanar;167
Castilla La Mancha;Toledo;Hormigos;767
Castilla La Mancha;Toledo;Huecas;630
Castilla La Mancha;Toledo;Huerta de Valdecarábanos;1943
Castilla La Mancha;Toledo;Iglesuela (La);430
Castilla La Mancha;Toledo;Illán de Vacas;5
Castilla La Mancha;Toledo;Illescas;21264
Castilla La Mancha;Toledo;Lagartera;1596
Castilla La Mancha;Toledo;Layos;484
Castilla La Mancha;Toledo;Lillo;3062
Castilla La Mancha;Toledo;Lominchar;1865
Castilla La Mancha;Toledo;Lucillos;671
Castilla La Mancha;Toledo;Madridejos;11404
Castilla La Mancha;Toledo;Magán;2936
Castilla La Mancha;Toledo;Malpica de Tajo;2153
Castilla La Mancha;Toledo;Manzaneque;478
Castilla La Mancha;Toledo;Maqueda;548
Castilla La Mancha;Toledo;Marjaliza;316
Castilla La Mancha;Toledo;Marrupe;174
Castilla La Mancha;Toledo;Mascaraque;536
Castilla La Mancha;Toledo;Mata (La);1053
Castilla La Mancha;Toledo;Mazarambroz;1370
Castilla La Mancha;Toledo;Mejorada;1340
Castilla La Mancha;Toledo;Menasalbas;3327
Castilla La Mancha;Toledo;Méntrida;4599
Castilla La Mancha;Toledo;Mesegar de Tajo;253
Castilla La Mancha;Toledo;Miguel Esteban;5754
Castilla La Mancha;Toledo;Mocejón;4922
Castilla La Mancha;Toledo;Mohedas de la Jara;502
Castilla La Mancha;Toledo;Montearagón;575
Castilla La Mancha;Toledo;Montesclaros;434
Castilla La Mancha;Toledo;Mora;10554
Castilla La Mancha;Toledo;Nambroca;3666
Castilla La Mancha;Toledo;Nava de Ricomalillo (La);639
Castilla La Mancha;Toledo;Navahermosa;4338
Castilla La Mancha;Toledo;Navalcán;2390
Castilla La Mancha;Toledo;Navalmoralejo;74
Castilla La Mancha;Toledo;Navalmorales (Los);2773
Castilla La Mancha;Toledo;Navalucillos (Los);2677
Castilla La Mancha;Toledo;Navamorcuende;689
Castilla La Mancha;Toledo;Noblejas;3521
Castilla La Mancha;Toledo;Noez;928
Castilla La Mancha;Toledo;Nombela;1035
Castilla La Mancha;Toledo;Novés;2712
Castilla La Mancha;Toledo;Numancia de la Sagra;4605
Castilla La Mancha;Toledo;Nuño Gómez;186
Castilla La Mancha;Toledo;Ocaña;9468
Castilla La Mancha;Toledo;Olías del Rey;6656
Castilla La Mancha;Toledo;Ontígola;3665
Castilla La Mancha;Toledo;Orgaz;2843
Castilla La Mancha;Toledo;Oropesa;2937
Castilla La Mancha;Toledo;Otero;350
Castilla La Mancha;Toledo;Palomeque;917
Castilla La Mancha;Toledo;Pantoja;3441
Castilla La Mancha;Toledo;Paredes de Escalona;168
Castilla La Mancha;Toledo;Parrillas;417
Castilla La Mancha;Toledo;Pelahustán;381
Castilla La Mancha;Toledo;Pepino;2270
Castilla La Mancha;Toledo;Polán;4047
Castilla La Mancha;Toledo;Portillo de Toledo;2211
Castilla La Mancha;Toledo;Puebla de Almoradiel (La);6122
Castilla La Mancha;Toledo;Puebla de Montalbán (La);8431
Castilla La Mancha;Toledo;Pueblanueva (La);2343
Castilla La Mancha;Toledo;Puente del Arzobispo (El);1458
Castilla La Mancha;Toledo;Puerto de San Vicente;210
Castilla La Mancha;Toledo;Pulgar;1681
Castilla La Mancha;Toledo;Quero;1313
Castilla La Mancha;Toledo;Quintanar de la Orden;12736
Castilla La Mancha;Toledo;Quismondo;1689
Castilla La Mancha;Toledo;Real de San Vicente (El);1097
Castilla La Mancha;Toledo;Recas;3727
Castilla La Mancha;Toledo;Retamoso de la Jara;125
Castilla La Mancha;Toledo;Rielves;738
Castilla La Mancha;Toledo;Robledo del Mazo;390
Castilla La Mancha;Toledo;Romeral (El);789
Castilla La Mancha;Toledo;San Bartolomé de las Abiertas;577
Castilla La Mancha;Toledo;San Martín de Montalbán;795
Castilla La Mancha;Toledo;San Martín de Pusa;841
Castilla La Mancha;Toledo;San Pablo de los Montes;2220
Castilla La Mancha;Toledo;San Román de los Montes;1747
Castilla La Mancha;Toledo;Santa Ana de Pusa;466
Castilla La Mancha;Toledo;Santa Cruz de la Zarza;4929
Castilla La Mancha;Toledo;Santa Cruz del Retamar;2972
Castilla La Mancha;Toledo;Santa Olalla;3465
Castilla La Mancha;Toledo;Santo Domingo-Caudilla;994
Castilla La Mancha;Toledo;Sartajada;108
Castilla La Mancha;Toledo;Segurilla;1220
Castilla La Mancha;Toledo;Seseña;16231
Castilla La Mancha;Toledo;Sevilleja de la Jara;890
Castilla La Mancha;Toledo;Sonseca;11265
Castilla La Mancha;Toledo;Sotillo de las Palomas;224
Castilla La Mancha;Toledo;Talavera de la Reina;88856
Castilla La Mancha;Toledo;Tembleque;2376
Castilla La Mancha;Toledo;Toboso (El);2219
Castilla La Mancha;Toledo;Toledo;82291
Castilla La Mancha;Toledo;Torralba de Oropesa;276
Castilla La Mancha;Toledo;Torre de Esteban Hambrán (La);1775
Castilla La Mancha;Toledo;Torrecilla de la Jara;303
Castilla La Mancha;Toledo;Torrico;846
Castilla La Mancha;Toledo;Torrijos;13117
Castilla La Mancha;Toledo;Totanés;429
Castilla La Mancha;Toledo;Turleque;942
Castilla La Mancha;Toledo;Ugena;5170
Castilla La Mancha;Toledo;Urda;3136
Castilla La Mancha;Toledo;Valdeverdeja;720
Castilla La Mancha;Toledo;Valmojado;3806
Castilla La Mancha;Toledo;Velada;2765
Castilla La Mancha;Toledo;Ventas con Peña Aguilera (Las);1338
Castilla La Mancha;Toledo;Ventas de Retamosa (Las);2873
Castilla La Mancha;Toledo;Ventas de San Julián (Las);236
Castilla La Mancha;Toledo;Villa de Don Fadrique (La);4206
Castilla La Mancha;Toledo;Villacañas;10645
Castilla La Mancha;Toledo;Villafranca de los Caballeros;5561
Castilla La Mancha;Toledo;Villaluenga de la Sagra;3887
Castilla La Mancha;Toledo;Villamiel de Toledo;862
Castilla La Mancha;Toledo;Villaminaya;592
Castilla La Mancha;Toledo;Villamuelas;737
Castilla La Mancha;Toledo;Villanueva de Alcardete;3783
Castilla La Mancha;Toledo;Villanueva de Bogas;780
Castilla La Mancha;Toledo;Villarejo de Montalbán;73
Castilla La Mancha;Toledo;Villarrubia de Santiago;2936
Castilla La Mancha;Toledo;Villaseca de la Sagra;1806
Castilla La Mancha;Toledo;Villasequilla;2632
Castilla La Mancha;Toledo;Villatobas;2707
Castilla La Mancha;Toledo;Viso de San Juan (El);3319
Castilla La Mancha;Toledo;Yébenes (Los);6479
Castilla La Mancha;Toledo;Yeles;4544
Castilla La Mancha;Toledo;Yepes;5200
Castilla La Mancha;Toledo;Yuncler;3332
Castilla La Mancha;Toledo;Yunclillos;794
Castilla La Mancha;Toledo;Yuncos;9185
Castilla León;Ávila;Adanero;295
Castilla León;Ávila;Adrada (La);2734
Castilla León;Ávila;Albornos;243
Castilla León;Ávila;Aldeanueva de Santa Cruz;151
Castilla León;Ávila;Aldeaseca;263
Castilla León;Ávila;Aldehuela (La);210
Castilla León;Ávila;Amavida;183
Castilla León;Ávila;Arenal (El);1046
Castilla León;Ávila;Arenas de San Pedro;6830
Castilla León;Ávila;Arevalillo;118
Castilla León;Ávila;Arévalo;8074
Castilla León;Ávila;Aveinte;106
Castilla León;Ávila;Avellaneda;31
Castilla León;Ávila;Ávila;56855
Castilla León;Ávila;Barco de Ávila (El);2721
Castilla León;Ávila;Barraco (El);2152
Castilla León;Ávila;Barromán;223
Castilla León;Ávila;Becedas;300
Castilla León;Ávila;Becedillas;133
Castilla León;Ávila;Bercial de Zapardiel;245
Castilla León;Ávila;Berlanas (Las);356
Castilla León;Ávila;Bernuy-Zapardiel;152
Castilla León;Ávila;Berrocalejo de Aragona;50
Castilla León;Ávila;Blascomillán;224
Castilla León;Ávila;Blasconuño de Matacabras;17
Castilla León;Ávila;Blascosancho;133
Castilla León;Ávila;Bohodón (El);156
Castilla León;Ávila;Bohoyo;353
Castilla León;Ávila;Bonilla de la Sierra;136
Castilla León;Ávila;Brabos;60
Castilla León;Ávila;Bularros;85
Castilla León;Ávila;Burgohondo;1278
Castilla León;Ávila;Cabezas de Alambre;181
Castilla León;Ávila;Cabezas del Pozo;106
Castilla León;Ávila;Cabezas del Villar;359
Castilla León;Ávila;Cabizuela;121
Castilla León;Ávila;Canales;52
Castilla León;Ávila;Candeleda;5166
Castilla León;Ávila;Cantiveros;151
Castilla León;Ávila;Cardeñosa;532
Castilla León;Ávila;Carrera (La);214
Castilla León;Ávila;Casas del Puerto;118
Castilla León;Ávila;Casasola;110
Castilla León;Ávila;Casavieja;1599
Castilla León;Ávila;Casillas;853
Castilla León;Ávila;Castellanos de Zapardiel;109
Castilla León;Ávila;Cebreros;3501
Castilla León;Ávila;Cepeda la Mora;104
Castilla León;Ávila;Chamartín;93
Castilla León;Ávila;Cillán;124
Castilla León;Ávila;Cisla;154
Castilla León;Ávila;Colilla (La);325
Castilla León;Ávila;Collado de Contreras;220
Castilla León;Ávila;Collado del Mirón;44
Castilla León;Ávila;Constanzana;138
Castilla León;Ávila;Crespos;591
Castilla León;Ávila;Cuevas del Valle;535
Castilla León;Ávila;Diego del Carpio;192
Castilla León;Ávila;Donjimeno;104
Castilla León;Ávila;Donvidas;46
Castilla León;Ávila;Espinosa de los Caballeros;111
Castilla León;Ávila;Flores de Ávila;364
Castilla León;Ávila;Fontiveros;882
Castilla León;Ávila;Fresnedilla;104
Castilla León;Ávila;Fresno (El);550
Castilla León;Ávila;Fuente el Saúz;230
Castilla León;Ávila;Fuentes de Año;154
Castilla León;Ávila;Gallegos de Altamiros;67
Castilla León;Ávila;Gallegos de Sobrinos;81
Castilla León;Ávila;Garganta del Villar;52
Castilla León;Ávila;Gavilanes;631
Castilla León;Ávila;Gemuño;169
Castilla León;Ávila;Gil García;40
Castilla León;Ávila;Gilbuena;93
Castilla León;Ávila;Gimialcón;94
Castilla León;Ávila;Gotarrendura;196
Castilla León;Ávila;Grandes y San Martín;41
Castilla León;Ávila;Guisando;598
Castilla León;Ávila;Gutierre-Muñoz;100
Castilla León;Ávila;Hernansancho;210
Castilla León;Ávila;Herradón de Pinares;560
Castilla León;Ávila;Herreros de Suso;171
Castilla León;Ávila;Higuera de las Dueñas;328
Castilla León;Ávila;Hija de Dios (La);81
Castilla León;Ávila;Horcajada (La);605
Castilla León;Ávila;Horcajo de las Torres;619
Castilla León;Ávila;Hornillo (El);359
Castilla León;Ávila;Hoyo de Pinares (El);2401
Castilla León;Ávila;Hoyocasero;360
Castilla León;Ávila;Hoyorredondo;91
Castilla León;Ávila;Hoyos de Miguel Muñoz;45
Castilla León;Ávila;Hoyos del Collado;38
Castilla León;Ávila;Hoyos del Espino;469
Castilla León;Ávila;Hurtumpascual;81
Castilla León;Ávila;Junciana;84
Castilla León;Ávila;Langa;536
Castilla León;Ávila;Lanzahíta;969
Castilla León;Ávila;Llanos de Tormes (Los);93
Castilla León;Ávila;Losar del Barco (El);127
Castilla León;Ávila;Madrigal de las Altas Torres;1677
Castilla León;Ávila;Maello;747
Castilla León;Ávila;Malpartida de Corneja;148
Castilla León;Ávila;Mamblas;230
Castilla León;Ávila;Mancera de Arriba;101
Castilla León;Ávila;Manjabálago;44
Castilla León;Ávila;Marlín;40
Castilla León;Ávila;Martiherrero;274
Castilla León;Ávila;Martínez;169
Castilla León;Ávila;Mediana de Voltoya;109
Castilla León;Ávila;Medinilla;140
Castilla León;Ávila;Mengamuñoz;67
Castilla León;Ávila;Mesegar de Corneja;82
Castilla León;Ávila;Mijares;834
Castilla León;Ávila;Mingorría;444
Castilla León;Ávila;Mirón (El);172
Castilla León;Ávila;Mironcillo;119
Castilla León;Ávila;Mirueña de los Infanzones;127
Castilla León;Ávila;Mombeltrán;1220
Castilla León;Ávila;Monsalupe;63
Castilla León;Ávila;Moraleja de Matacabras;50
Castilla León;Ávila;Muñana;527
Castilla León;Ávila;Muñico;127
Castilla León;Ávila;Muñogalindo;408
Castilla León;Ávila;Muñogrande;77
Castilla León;Ávila;Muñomer del Peco;151
Castilla León;Ávila;Muñopepe;104
Castilla León;Ávila;Muñosancho;114
Castilla León;Ávila;Muñotello;92
Castilla León;Ávila;Narrillos del Álamo;101
Castilla León;Ávila;Narrillos del Rebollar;51
Castilla León;Ávila;Narros de Saldueña;140
Castilla León;Ávila;Narros del Castillo;181
Castilla León;Ávila;Narros del Puerto;41
Castilla León;Ávila;Nava de Arévalo;906
Castilla León;Ávila;Nava del Barco;115
Castilla León;Ávila;Navacepedilla de Corneja;113
Castilla León;Ávila;Navadijos;60
Castilla León;Ávila;Navaescurial;58
Castilla León;Ávila;Navahondilla;335
Castilla León;Ávila;Navalacruz;262
Castilla León;Ávila;Navalmoral;464
Castilla León;Ávila;Navalonguilla;329
Castilla León;Ávila;Navalosa;394
Castilla León;Ávila;Navalperal de Pinares;966
Castilla León;Ávila;Navalperal de Tormes;122
Castilla León;Ávila;Navaluenga;2245
Castilla León;Ávila;Navaquesera;32
Castilla León;Ávila;Navarredonda de Gredos;461
Castilla León;Ávila;Navarredondilla;246
Castilla León;Ávila;Navarrevisca;340
Castilla León;Ávila;Navas del Marqués (Las);5784
Castilla León;Ávila;Navatalgordo;279
Castilla León;Ávila;Navatejares;74
Castilla León;Ávila;Neila de San Miguel;93
Castilla León;Ávila;Niharra;170
Castilla León;Ávila;Ojos-Albos;65
Castilla León;Ávila;Orbita;96
Castilla León;Ávila;Oso (El);198
Castilla León;Ávila;Padiernos;258
Castilla León;Ávila;Pajares de Adaja;194
Castilla León;Ávila;Palacios de Goda;455
Castilla León;Ávila;Papatrigo;268
Castilla León;Ávila;Parral (El);115
Castilla León;Ávila;Pascualcobo;36
Castilla León;Ávila;Pedro-Rodríguez;221
Castilla León;Ávila;Pedro Bernardo;1017
Castilla León;Ávila;Peguerinos;342
Castilla León;Ávila;Peñalba de Ávila;133
Castilla León;Ávila;Piedrahíta;2055
Castilla León;Ávila;Piedralaves;2250
Castilla León;Ávila;Poveda;70
Castilla León;Ávila;Poyales del Hoyo;607
Castilla León;Ávila;Pozanco;58
Castilla León;Ávila;Pradosegar;156
Castilla León;Ávila;Puerto Castilla;122
Castilla León;Ávila;Rasueros;258
Castilla León;Ávila;Riocabado;194
Castilla León;Ávila;Riofrío;257
Castilla León;Ávila;Rivilla de Barajas;72
Castilla León;Ávila;Salobral;122
Castilla León;Ávila;Salvadiós;95
Castilla León;Ávila;San Bartolomé de Béjar;46
Castilla León;Ávila;San Bartolomé de Corneja;66
Castilla León;Ávila;San Bartolomé de Pinares;641
Castilla León;Ávila;San Esteban de los Patos;26
Castilla León;Ávila;San Esteban de Zapardiel;54
Castilla León;Ávila;San Esteban del Valle;865
Castilla León;Ávila;San García de Ingelmos;118
Castilla León;Ávila;San Juan de Gredos;366
Castilla León;Ávila;San Juan de la Encinilla;103
Castilla León;Ávila;San Juan de la Nava;538
Castilla León;Ávila;San Juan del Molinillo;297
Castilla León;Ávila;San Juan del Olmo;123
Castilla León;Ávila;San Lorenzo de Tormes;56
Castilla León;Ávila;San Martín de la Vega del Alberche;217
Castilla León;Ávila;San Martín del Pimpollar;240
Castilla León;Ávila;San Miguel de Corneja;82
Castilla León;Ávila;San Miguel de Serrezuela;161
Castilla León;Ávila;San Pascual;52
Castilla León;Ávila;San Pedro del Arroyo;521
Castilla León;Ávila;San Vicente de Arévalo;207
Castilla León;Ávila;Sanchidrián;856
Castilla León;Ávila;Sanchorreja;106
Castilla León;Ávila;Santa Cruz de Pinares;191
Castilla León;Ávila;Santa Cruz del Valle;480
Castilla León;Ávila;Santa María de los Caballeros;100
Castilla León;Ávila;Santa María del Arroyo;107
Castilla León;Ávila;Santa María del Berrocal;493
Castilla León;Ávila;Santa María del Cubillo;349
Castilla León;Ávila;Santa María del Tiétar;640
Castilla León;Ávila;Santiago del Collado;218
Castilla León;Ávila;Santiago del Tormes;153
Castilla León;Ávila;Santo Domingo de las Posadas;78
Castilla León;Ávila;Santo Tomé de Zabarcos;86
Castilla León;Ávila;Serrada (La);128
Castilla León;Ávila;Serranillos;297
Castilla León;Ávila;Sigeres;63
Castilla León;Ávila;Sinlabajos;151
Castilla León;Ávila;Solana de Ávila;156
Castilla León;Ávila;Solana de Rioalmar;244
Castilla León;Ávila;Solosancho;974
Castilla León;Ávila;Sotalbo;268
Castilla León;Ávila;Sotillo de la Adrada;4769
Castilla León;Ávila;Tiemblo (El);4337
Castilla León;Ávila;Tiñosillos;843
Castilla León;Ávila;Tolbaños;108
Castilla León;Ávila;Tormellas;73
Castilla León;Ávila;Tornadizos de Ávila;426
Castilla León;Ávila;Torre (La);287
Castilla León;Ávila;Tórtoles;87
Castilla León;Ávila;Umbrías;139
Castilla León;Ávila;Vadillo de la Sierra;93
Castilla León;Ávila;Valdecasa;74
Castilla León;Ávila;Vega de Santa María;103
Castilla León;Ávila;Velayos;245
Castilla León;Ávila;Villaflor;139
Castilla León;Ávila;Villafranca de la Sierra;155
Castilla León;Ávila;Villanueva de Ávila;259
Castilla León;Ávila;Villanueva de Gómez;151
Castilla León;Ávila;Villanueva del Aceral;159
Castilla León;Ávila;Villanueva del Campillo;122
Castilla León;Ávila;Villar de Corneja;51
Castilla León;Ávila;Villarejo del Valle;451
Castilla León;Ávila;Villatoro;200
Castilla León;Ávila;Viñegra de Moraña;64
Castilla León;Ávila;Vita;99
Castilla León;Ávila;Zapardiel de la Cañada;126
Castilla León;Ávila;Zapardiel de la Ribera;131
Castilla León;Burgos;Abajas;26
Castilla León;Burgos;Adrada de Haza;252
Castilla León;Burgos;Aguas Cándidas;61
Castilla León;Burgos;Aguilar de Bureba;70
Castilla León;Burgos;Albillos;212
Castilla León;Burgos;Alcocero de Mola;41
Castilla León;Burgos;Alfoz de Bricia;97
Castilla León;Burgos;Alfoz de Quintanadueñas;1787
Castilla León;Burgos;Alfoz de Santa Gadea;115
Castilla León;Burgos;Altable;54
Castilla León;Burgos;Altos (Los);205
Castilla León;Burgos;Ameyugo;97
Castilla León;Burgos;Anguix;157
Castilla León;Burgos;Aranda de Duero;32928
Castilla León;Burgos;Arandilla;182
Castilla León;Burgos;Arauzo de Miel;338
Castilla León;Burgos;Arauzo de Salce;69
Castilla León;Burgos;Arauzo de Torre;96
Castilla León;Burgos;Arcos;1071
Castilla León;Burgos;Arenillas de Riopisuerga;186
Castilla León;Burgos;Arija;185
Castilla León;Burgos;Arlanzón;438
Castilla León;Burgos;Arraya de Oca;48
Castilla León;Burgos;Atapuerca;208
Castilla León;Burgos;Ausines (Los);143
Castilla León;Burgos;Avellanosa de Muñó;136
Castilla León;Burgos;Bahabón de Esgueva;118
Castilla León;Burgos;Balbases (Los);373
Castilla León;Burgos;Baños de Valdearados;400
Castilla León;Burgos;Bañuelos de Bureba;32
Castilla León;Burgos;Barbadillo de Herreros;117
Castilla León;Burgos;Barbadillo del Mercado;154
Castilla León;Burgos;Barbadillo del Pez;87
Castilla León;Burgos;Barrio de Muñó;30
Castilla León;Burgos;Barrios de Bureba (Los);224
Castilla León;Burgos;Barrios de Colina;65
Castilla León;Burgos;Basconcillos del Tozo;336
Castilla León;Burgos;Bascuñana;47
Castilla León;Burgos;Belbimbre;77
Castilla León;Burgos;Belorado;2172
Castilla León;Burgos;Berberana;76
Castilla León;Burgos;Berlangas de Roa;202
Castilla León;Burgos;Berzosa de Bureba;41
Castilla León;Burgos;Bozoó;108
Castilla León;Burgos;Brazacorta;73
Castilla León;Burgos;Briviesca;7937
Castilla León;Burgos;Bugedo;177
Castilla León;Burgos;Buniel;427
Castilla León;Burgos;Burgos;178966
Castilla León;Burgos;Busto de Bureba;199
Castilla León;Burgos;Cabañes de Esgueva;223
Castilla León;Burgos;Cabezón de la Sierra;59
Castilla León;Burgos;Caleruega;491
Castilla León;Burgos;Campillo de Aranda;203
Castilla León;Burgos;Campolara;67
Castilla León;Burgos;Canicosa de la Sierra;601
Castilla León;Burgos;Cantabrana;31
Castilla León;Burgos;Carazo;47
Castilla León;Burgos;Carcedo de Bureba;43
Castilla León;Burgos;Carcedo de Burgos;329
Castilla León;Burgos;Cardeñadijo;1081
Castilla León;Burgos;Cardeñajimeno;891
Castilla León;Burgos;Cardeñuela Riopico;128
Castilla León;Burgos;Carrias;30
Castilla León;Burgos;Cascajares de Bureba;44
Castilla León;Burgos;Cascajares de la Sierra;34
Castilla León;Burgos;Castellanos de Castro;54
Castilla León;Burgos;Castil de Peones;27
Castilla León;Burgos;Castildelgado;59
Castilla León;Burgos;Castrillo de la Reina;234
Castilla León;Burgos;Castrillo de la Vega;677
Castilla León;Burgos;Castrillo de Riopisuerga;66
Castilla León;Burgos;Castrillo del Val;721
Castilla León;Burgos;Castrillo Matajudíos;63
Castilla León;Burgos;Castrojeriz;891
Castilla León;Burgos;Cavia;284
Castilla León;Burgos;Cayuela;171
Castilla León;Burgos;Cebrecos;55
Castilla León;Burgos;Celada del Camino;98
Castilla León;Burgos;Cerezo de Río Tirón;653
Castilla León;Burgos;Cerratón de Juarros;59
Castilla León;Burgos;Ciadoncha;80
Castilla León;Burgos;Cillaperlata;40
Castilla León;Burgos;Cilleruelo de Abajo;282
Castilla León;Burgos;Cilleruelo de Arriba;62
Castilla León;Burgos;Ciruelos de Cervera;119
Castilla León;Burgos;Cogollos;488
Castilla León;Burgos;Condado de Treviño;1432
Castilla León;Burgos;Contreras;97
Castilla León;Burgos;Coruña del Conde;138
Castilla León;Burgos;Covarrubias;639
Castilla León;Burgos;Cubillo del Campo;102
Castilla León;Burgos;Cubo de Bureba;116
Castilla León;Burgos;Cueva de Roa (La);112
Castilla León;Burgos;Cuevas de San Clemente;52
Castilla León;Burgos;Encío;45
Castilla León;Burgos;Espinosa de Cervera;107
Castilla León;Burgos;Espinosa de los Monteros;2129
Castilla León;Burgos;Espinosa del Camino;33
Castilla León;Burgos;Estépar;739
Castilla León;Burgos;Fontioso;64
Castilla León;Burgos;Frandovínez;109
Castilla León;Burgos;Fresneda de la Sierra Tirón;125
Castilla León;Burgos;Fresneña;107
Castilla León;Burgos;Fresnillo de las Dueñas;460
Castilla León;Burgos;Fresno de Río Tirón;200
Castilla León;Burgos;Fresno de Rodilla;47
Castilla León;Burgos;Frías;274
Castilla León;Burgos;Fuentebureba;53
Castilla León;Burgos;Fuentecén;252
Castilla León;Burgos;Fuentelcésped;198
Castilla León;Burgos;Fuentelisendo;100
Castilla León;Burgos;Fuentemolinos;104
Castilla León;Burgos;Fuentenebro;158
Castilla León;Burgos;Fuentespina;692
Castilla León;Burgos;Galbarros;28
Castilla León;Burgos;Gallega (La);72
Castilla León;Burgos;Grijalba;128
Castilla León;Burgos;Grisaleña;43
Castilla León;Burgos;Gumiel de Izán;643
Castilla León;Burgos;Gumiel de Mercado;413
Castilla León;Burgos;Hacinas;179
Castilla León;Burgos;Haza;33
Castilla León;Burgos;Hontanas;59
Castilla León;Burgos;Hontangas;123
Castilla León;Burgos;Hontoria de la Cantera;122
Castilla León;Burgos;Hontoria de Valdearados;237
Castilla León;Burgos;Hontoria del Pinar;798
Castilla León;Burgos;Hormazas (Las);109
Castilla León;Burgos;Hornillos del Camino;63
Castilla León;Burgos;Horra (La);400
Castilla León;Burgos;Hortigüela;110
Castilla León;Burgos;Hoyales de Roa;238
Castilla León;Burgos;Huérmeces;131
Castilla León;Burgos;Huerta de Arriba;150
Castilla León;Burgos;Huerta de Rey;1113
Castilla León;Burgos;Humada;153
Castilla León;Burgos;Hurones;79
Castilla León;Burgos;Ibeas de Juarros;1366
Castilla León;Burgos;Ibrillos;79
Castilla León;Burgos;Iglesiarrubia;53
Castilla León;Burgos;Iglesias;149
Castilla León;Burgos;Isar;381
Castilla León;Burgos;Itero del Castillo;102
Castilla León;Burgos;Jaramillo de la Fuente;37
Castilla León;Burgos;Jaramillo Quemado;7
Castilla León;Burgos;Junta de Traslaloma;163
Castilla León;Burgos;Junta de Villalba de Losa;119
Castilla León;Burgos;Jurisdicción de Lara;51
Castilla León;Burgos;Jurisdicción de San Zadornil;93
Castilla León;Burgos;Lerma;2836
Castilla León;Burgos;Llano de Bureba;69
Castilla León;Burgos;Madrigal del Monte;188
Castilla León;Burgos;Madrigalejo del Monte;185
Castilla León;Burgos;Mahamud;146
Castilla León;Burgos;Mambrilla de Castrejón;114
Castilla León;Burgos;Mambrillas de Lara;54
Castilla León;Burgos;Mamolar;41
Castilla León;Burgos;Manciles;31
Castilla León;Burgos;Mazuela;72
Castilla León;Burgos;Mecerreyes;276
Castilla León;Burgos;Medina de Pomar;6321
Castilla León;Burgos;Melgar de Fernamental;1866
Castilla León;Burgos;Merindad de Cuesta-Urria;452
Castilla León;Burgos;Merindad de Montija;853
Castilla León;Burgos;Merindad de Río Ubierna;1406
Castilla León;Burgos;Merindad de Sotoscueva;495
Castilla León;Burgos;Merindad de Valdeporres;467
Castilla León;Burgos;Merindad de Valdivielso;442
Castilla León;Burgos;Milagros;501
Castilla León;Burgos;Miranda de Ebro;39264
Castilla León;Burgos;Miraveche;94
Castilla León;Burgos;Modúbar de la Emparedada;472
Castilla León;Burgos;Monasterio de la Sierra;48
Castilla León;Burgos;Monasterio de Rodilla;200
Castilla León;Burgos;Moncalvillo;106
Castilla León;Burgos;Monterrubio de la Demanda;78
Castilla León;Burgos;Montorio;200
Castilla León;Burgos;Moradillo de Roa;193
Castilla León;Burgos;Nava de Roa;248
Castilla León;Burgos;Navas de Bureba;44
Castilla León;Burgos;Nebreda;84
Castilla León;Burgos;Neila;204
Castilla León;Burgos;Olmedillo de Roa;206
Castilla León;Burgos;Olmillos de Muñó;45
Castilla León;Burgos;Oña;1256
Castilla León;Burgos;Oquillas;64
Castilla León;Burgos;Orbaneja Riopico;220
Castilla León;Burgos;Padilla de Abajo;90
Castilla León;Burgos;Padilla de Arriba;84
Castilla León;Burgos;Padrones de Bureba;45
Castilla León;Burgos;Palacios de la Sierra;858
Castilla León;Burgos;Palacios de Riopisuerga;35
Castilla León;Burgos;Palazuelos de la Sierra;67
Castilla León;Burgos;Palazuelos de Muñó;60
Castilla León;Burgos;Pampliega;381
Castilla León;Burgos;Pancorbo;538
Castilla León;Burgos;Pardilla;130
Castilla León;Burgos;Partido de la Sierra en Tobalina;85
Castilla León;Burgos;Pedrosa de Duero;521
Castilla León;Burgos;Pedrosa de Río Úrbel;257
Castilla León;Burgos;Pedrosa del Páramo;89
Castilla León;Burgos;Pedrosa del Príncipe;183
Castilla León;Burgos;Peñaranda de Duero;578
Castilla León;Burgos;Peral de Arlanza;167
Castilla León;Burgos;Piérnigas;52
Castilla León;Burgos;Pineda de la Sierra;113
Castilla León;Burgos;Pineda Trasmonte;146
Castilla León;Burgos;Pinilla de los Barruecos;109
Castilla León;Burgos;Pinilla de los Moros;42
Castilla León;Burgos;Pinilla Trasmonte;198
Castilla León;Burgos;Poza de la Sal;338
Castilla León;Burgos;Prádanos de Bureba;55
Castilla León;Burgos;Pradoluengo;1471
Castilla León;Burgos;Presencio;213
Castilla León;Burgos;Puebla de Arganzón (La);529
Castilla León;Burgos;Puentedura;116
Castilla León;Burgos;Quemada;263
Castilla León;Burgos;Quintana del Pidio;183
Castilla León;Burgos;Quintanabureba;38
Castilla León;Burgos;Quintanaélez;75
Castilla León;Burgos;Quintanaortuño;233
Castilla León;Burgos;Quintanapalla;125
Castilla León;Burgos;Quintanar de la Sierra;2053
Castilla León;Burgos;Quintanavides;102
Castilla León;Burgos;Quintanilla de la Mata;147
Castilla León;Burgos;Quintanilla del Agua y Tordueles;546
Castilla León;Burgos;Quintanilla del Coco;87
Castilla León;Burgos;Quintanilla San García;101
Castilla León;Burgos;Quintanilla Vivar;741
Castilla León;Burgos;Quintanillas (Las);396
Castilla León;Burgos;Rabanera del Pinar;138
Castilla León;Burgos;Rábanos;94
Castilla León;Burgos;Rabé de las Calzadas;213
Castilla León;Burgos;Rebolledo de la Torre;144
Castilla León;Burgos;Redecilla del Camino;133
Castilla León;Burgos;Redecilla del Campo;75
Castilla León;Burgos;Regumiel de la Sierra;433
Castilla León;Burgos;Reinoso;15
Castilla León;Burgos;Retuerta;66
Castilla León;Burgos;Revilla del Campo;119
Castilla León;Burgos;Revilla Vallejera;87
Castilla León;Burgos;Revilla y Ahedo (La);143
Castilla León;Burgos;Revillarruz;443
Castilla León;Burgos;Rezmondo;20
Castilla León;Burgos;Riocavado de la Sierra;60
Castilla León;Burgos;Roa;2495
Castilla León;Burgos;Rojas;81
Castilla León;Burgos;Royuela de Río Franco;244
Castilla León;Burgos;Rubena;200
Castilla León;Burgos;Rublacedo de Abajo;34
Castilla León;Burgos;Rucandio;85
Castilla León;Burgos;Salas de Bureba;138
Castilla León;Burgos;Salas de los Infantes;2140
Castilla León;Burgos;Saldaña de Burgos;185
Castilla León;Burgos;Salinillas de Bureba;51
Castilla León;Burgos;San Adrián de Juarros;67
Castilla León;Burgos;San Juan del Monte;148
Castilla León;Burgos;San Mamés de Burgos;291
Castilla León;Burgos;San Martín de Rubiales;190
Castilla León;Burgos;San Millán de Lara;75
Castilla León;Burgos;San Vicente del Valle;37
Castilla León;Burgos;Santa Cecilia;105
Castilla León;Burgos;Santa Cruz de la Salceda;170
Castilla León;Burgos;Santa Cruz del Valle Urbión;101
Castilla León;Burgos;Santa Gadea del Cid;156
Castilla León;Burgos;Santa Inés;154
Castilla León;Burgos;Santa María del Campo;700
Castilla León;Burgos;Santa María del Invierno;64
Castilla León;Burgos;Santa María del Mercadillo;150
Castilla León;Burgos;Santa María Rivarredonda;113
Castilla León;Burgos;Santa Olalla de Bureba;39
Castilla León;Burgos;Santibáñez de Esgueva;126
Castilla León;Burgos;Santibáñez del Val;65
Castilla León;Burgos;Santo Domingo de Silos;319
Castilla León;Burgos;Sargentes de la Lora;151
Castilla León;Burgos;Sarracín;298
Castilla León;Burgos;Sasamón;1207
Castilla León;Burgos;Sequera de Haza (La);37
Castilla León;Burgos;Solarana;107
Castilla León;Burgos;Sordillos;33
Castilla León;Burgos;Sotillo de la Ribera;588
Castilla León;Burgos;Sotragero;254
Castilla León;Burgos;Sotresgudo;543
Castilla León;Burgos;Susinos del Páramo;118
Castilla León;Burgos;Tamarón;47
Castilla León;Burgos;Tardajos;843
Castilla León;Burgos;Tejada;40
Castilla León;Burgos;Terradillos de Esgueva;113
Castilla León;Burgos;Tinieblas de la Sierra;43
Castilla León;Burgos;Tobar;32
Castilla León;Burgos;Tordómar;371
Castilla León;Burgos;Torrecilla del Monte;75
Castilla León;Burgos;Torregalindo;149
Castilla León;Burgos;Torrelara;24
Castilla León;Burgos;Torrepadre;86
Castilla León;Burgos;Torresandino;740
Castilla León;Burgos;Tórtoles de Esgueva;506
Castilla León;Burgos;Tosantos;53
Castilla León;Burgos;Trespaderne;1131
Castilla León;Burgos;Tubilla del Agua;176
Castilla León;Burgos;Tubilla del Lago;154
Castilla León;Burgos;Úrbel del Castillo;96
Castilla León;Burgos;Vadocondes;415
Castilla León;Burgos;Valdeande;119
Castilla León;Burgos;Valdezate;155
Castilla León;Burgos;Valdorros;280
Castilla León;Burgos;Vallarta de Bureba;50
Castilla León;Burgos;Valle de las Navas;624
Castilla León;Burgos;Valle de Losa;622
Castilla León;Burgos;Valle de Manzanedo;131
Castilla León;Burgos;Valle de Mena;3926
Castilla León;Burgos;Valle de Oca;192
Castilla León;Burgos;Valle de Santibáñez;561
Castilla León;Burgos;Valle de Sedano;504
Castilla León;Burgos;Valle de Tobalina;1023
Castilla León;Burgos;Valle de Valdebezana;613
Castilla León;Burgos;Valle de Valdelaguna;207
Castilla León;Burgos;Valle de Valdelucio;347
Castilla León;Burgos;Valle de Zamanzas;69
Castilla León;Burgos;Vallejera;48
Castilla León;Burgos;Valles de Palenzuela;90
Castilla León;Burgos;Valluércanes;90
Castilla León;Burgos;Valmala;32
Castilla León;Burgos;Vid de Bureba (La);32
Castilla León;Burgos;Vid y Barrios (La);276
Castilla León;Burgos;Vileña;33
Castilla León;Burgos;Villadiego;1764
Castilla León;Burgos;Villaescusa de Roa;153
Castilla León;Burgos;Villaescusa la Sombría;66
Castilla León;Burgos;Villaespasa;19
Castilla León;Burgos;Villafranca Montes de Oca;140
Castilla León;Burgos;Villafruela;236
Castilla León;Burgos;Villagalijo;76
Castilla León;Burgos;Villagonzalo Pedernales;1529
Castilla León;Burgos;Villahoz;361
Castilla León;Burgos;Villalba de Duero;680
Castilla León;Burgos;Villalbilla de Burgos;946
Castilla León;Burgos;Villalbilla de Gumiel;110
Castilla León;Burgos;Villaldemiro;74
Castilla León;Burgos;Villalmanzo;431
Castilla León;Burgos;Villamayor de los Montes;212
Castilla León;Burgos;Villamayor de Treviño;101
Castilla León;Burgos;Villambistia;54
Castilla León;Burgos;Villamedianilla;19
Castilla León;Burgos;Villamiel de la Sierra;35
Castilla León;Burgos;Villangómez;261
Castilla León;Burgos;Villanueva de Argaño;117
Castilla León;Burgos;Villanueva de Carazo;35
Castilla León;Burgos;Villanueva de Gumiel;281
Castilla León;Burgos;Villanueva de Teba;49
Castilla León;Burgos;Villaquirán de la Puebla;52
Castilla León;Burgos;Villaquirán de los Infantes;171
Castilla León;Burgos;Villarcayo de Merindad de Castilla la Vieja;4820
Castilla León;Burgos;Villariezo;512
Castilla León;Burgos;Villasandino;223
Castilla León;Burgos;Villasur de Herreros;290
Castilla León;Burgos;Villatuelda;52
Castilla León;Burgos;Villaverde-Mogina;98
Castilla León;Burgos;Villaverde del Monte;169
Castilla León;Burgos;Villayerno Morquillas;215
Castilla León;Burgos;Villazopeque;68
Castilla León;Burgos;Villegas;99
Castilla León;Burgos;Villoruebo;59
Castilla León;Burgos;Viloria de Rioja;50
Castilla León;Burgos;Vilviestre del Pinar;743
Castilla León;Burgos;Vizcaínos;49
Castilla León;Burgos;Zael;117
Castilla León;Burgos;Zarzosa de Río Pisuerga;38
Castilla León;Burgos;Zazuar;255
Castilla León;Burgos;Zuñeda;60
Castilla León;León;Acebedo;267
Castilla León;León;Algadefe;325
Castilla León;León;Alija del Infantado;809
Castilla León;León;Almanza;609
Castilla León;León;Antigua (La);504
Castilla León;León;Ardón;629
Castilla León;León;Arganza;902
Castilla León;León;Astorga;12078
Castilla León;León;Balboa;406
Castilla León;León;Bañeza (La);11057
Castilla León;León;Barjas;279
Castilla León;León;Barrios de Luna (Los);318
Castilla León;León;Bembibre;10071
Castilla León;León;Benavides;2854
Castilla León;León;Benuza;639
Castilla León;León;Bercianos del Páramo;734
Castilla León;León;Bercianos del Real Camino;199
Castilla León;León;Berlanga del Bierzo;393
Castilla León;León;Boca de Huérgano;540
Castilla León;León;Boñar;2085
Castilla León;León;Borrenes;412
Castilla León;León;Brazuelo;329
Castilla León;León;Burgo Ranero (El);854
Castilla León;León;Burón;377
Castilla León;León;Bustillo del Páramo;1474
Castilla León;León;Cabañas Raras;1321
Castilla León;León;Cabreros del Río;484
Castilla León;León;Cabrillanes;984
Castilla León;León;Cacabelos;5534
Castilla León;León;Calzada del Coto;265
Castilla León;León;Campazas;155
Castilla León;León;Campo de Villavidel;242
Castilla León;León;Camponaraya;4246
Castilla León;León;Candín;325
Castilla León;León;Cármenes;403
Castilla León;León;Carracedelo;3712
Castilla León;León;Carrizo;2518
Castilla León;León;Carrocera;561
Castilla León;León;Carucedo;656
Castilla León;León;Castilfalé;89
Castilla León;León;Castrillo de Cabrera;165
Castilla León;León;Castrillo de la Valduerna;192
Castilla León;León;Castrocalbón;1100
Castilla León;León;Castrocontrigo;936
Castilla León;León;Castropodame;1816
Castilla León;León;Castrotierra de Valmadrigal;133
Castilla León;León;Cea;553
Castilla León;León;Cebanico;197
Castilla León;León;Cebrones del Río;581
Castilla León;León;Chozas de Abajo;2419
Castilla León;León;Cimanes de la Vega;580
Castilla León;León;Cimanes del Tejar;851
Castilla León;León;Cistierna;3721
Castilla León;León;Congosto;1748
Castilla León;León;Corbillos de los Oteros;259
Castilla León;León;Corullón;1124
Castilla León;León;Crémenes;680
Castilla León;León;Cuadros;1926
Castilla León;León;Cubillas de los Oteros;174
Castilla León;León;Cubillas de Rueda;511
Castilla León;León;Cubillos del Sil;1722
Castilla León;León;Destriana;630
Castilla León;León;Encinedo;894
Castilla León;León;Ercina (La);584
Castilla León;León;Escobar de Campos;60
Castilla León;León;Fabero;5319
Castilla León;León;Folgoso de la Ribera;1220
Castilla León;León;Fresno de la Vega;622
Castilla León;León;Fuentes de Carbajal;124
Castilla León;León;Garrafe de Torío;1239
Castilla León;León;Gordaliza del Pino;307
Castilla León;León;Gordoncillo;498
Castilla León;León;Gradefes;1092
Castilla León;León;Grajal de Campos;245
Castilla León;León;Gusendos de los Oteros;146
Castilla León;León;Hospital de Órbigo;1028
Castilla León;León;Igüeña;1438
Castilla León;León;Izagre;210
Castilla León;León;Joarilla de las Matas;378
Castilla León;León;Laguna Dalga;766
Castilla León;León;Laguna de Negrillos;1197
Castilla León;León;León;134305
Castilla León;León;Llamas de la Ribera;992
Castilla León;León;Lucillo;432
Castilla León;León;Luyego;789
Castilla León;León;Magaz de Cepeda;420
Castilla León;León;Mansilla de las Mulas;1975
Castilla León;León;Mansilla Mayor;344
Castilla León;León;Maraña;148
Castilla León;León;Matadeón de los Oteros;291
Castilla León;León;Matallana de Torío;1436
Castilla León;León;Matanza;246
Castilla León;León;Molinaseca;794
Castilla León;León;Murias de Paredes;514
Castilla León;León;Noceda del Bierzo;780
Castilla León;León;Oencia;395
Castilla León;León;Omañas (Las);318
Castilla León;León;Onzonilla;1750
Castilla León;León;Oseja de Sajambre;265
Castilla León;León;Pajares de los Oteros;368
Castilla León;León;Palacios de la Valduerna;466
Castilla León;León;Palacios del Sil;1225
Castilla León;León;Páramo del Sil;1527
Castilla León;León;Peranzanes;305
Castilla León;León;Pobladura de Pelayo García;472
Castilla León;León;Pola de Gordón (La);4077
Castilla León;León;Ponferrada;68736
Castilla León;León;Posada de Valdeón;514
Castilla León;León;Pozuelo del Páramo;505
Castilla León;León;Prado de la Guzpeña;138
Castilla León;León;Priaranza del Bierzo;866
Castilla León;León;Prioro;415
Castilla León;León;Puebla de Lillo;691
Castilla León;León;Puente de Domingo Flórez;1745
Castilla León;León;Quintana del Castillo;925
Castilla León;León;Quintana del Marco;450
Castilla León;León;Quintana y Congosto;567
Castilla León;León;Regueras de Arriba;345
Castilla León;León;Reyero;128
Castilla León;León;Riaño;525
Castilla León;León;Riego de la Vega;954
Castilla León;León;Riello;733
Castilla León;León;Rioseco de Tapia;433
Castilla León;León;Robla (La);4625
Castilla León;León;Roperuelos del Páramo;675
Castilla León;León;Sabero;1451
Castilla León;León;Sahagún;2837
Castilla León;León;San Adrián del Valle;135
Castilla León;León;San Andrés del Rabanedo;30906
Castilla León;León;San Cristóbal de la Polantera;891
Castilla León;León;San Emiliano;682
Castilla León;León;San Esteban de Nogales;305
Castilla León;León;San Justo de la Vega;2079
Castilla León;León;San Millán de los Caballeros;188
Castilla León;León;San Pedro Bercianos;303
Castilla León;León;Sancedo;591
Castilla León;León;Santa Colomba de Curueño;570
Castilla León;León;Santa Colomba de Somoza;464
Castilla León;León;Santa Cristina de Valmadrigal;325
Castilla León;León;Santa Elena de Jamuz;1235
Castilla León;León;Santa María de la Isla;587
Castilla León;León;Santa María de Ordás;328
Castilla León;León;Santa María del Monte de Cea;284
Castilla León;León;Santa María del Páramo;3179
Castilla León;León;Santa Marina del Rey;2181
Castilla León;León;Santas Martas;896
Castilla León;León;Santiago Millas;347
Castilla León;León;Santovenia de la Valdoncina;1972
Castilla León;León;Sariegos;4230
Castilla León;León;Sena de Luna;400
Castilla León;León;Sobrado;420
Castilla León;León;Soto de la Vega;1810
Castilla León;León;Soto y Amío;958
Castilla León;León;Toral de los Guzmanes;613
Castilla León;León;Toreno;3743
Castilla León;León;Torre del Bierzo;2583
Castilla León;León;Trabadelo;454
Castilla León;León;Truchas;539
Castilla León;León;Turcia;1167
Castilla León;León;Urdiales del Páramo;565
Castilla León;León;Val de San Lorenzo;596
Castilla León;León;Valdefresno;2091
Castilla León;León;Valdefuentes del Páramo;331
Castilla León;León;Valdelugueros;463
Castilla León;León;Valdemora;91
Castilla León;León;Valdepiélago;416
Castilla León;León;Valdepolo;1347
Castilla León;León;Valderas;2038
Castilla León;León;Valderrey;517
Castilla León;León;Valderrueda;1014
Castilla León;León;Valdesamario;214
Castilla León;León;Valdevimbre;1078
Castilla León;León;Valencia de Don Juan;5083
Castilla León;León;Vallecillo;129
Castilla León;León;Valverde-Enrique;199
Castilla León;León;Valverde de la Virgen;6427
Castilla León;León;Vecilla (La);437
Castilla León;León;Vega de Espinareda;2503
Castilla León;León;Vega de Infanzones;929
Castilla León;León;Vega de Valcarce;725
Castilla León;León;Vegacervera;354
Castilla León;León;Vegaquemada;470
Castilla León;León;Vegas del Condado;1263
Castilla León;León;Villablino;10660
Castilla León;León;Villabraz;127
Castilla León;León;Villadangos del Páramo;1141
Castilla León;León;Villadecanes;2196
Castilla León;León;Villademor de la Vega;397
Castilla León;León;Villafranca del Bierzo;3481
Castilla León;León;Villagatón;665
Castilla León;León;Villamañán;1297
Castilla León;León;Villamandos;341
Castilla León;León;Villamanín;1125
Castilla León;León;Villamartín de Don Sancho;153
Castilla León;León;Villamejil;815
Castilla León;León;Villamol;194
Castilla León;León;Villamontán de la Valduerna;917
Castilla León;León;Villamoratiel de las Matas;166
Castilla León;León;Villanueva de las Manzanas;551
Castilla León;León;Villaobispo de Otero;640
Castilla León;León;Villaornate y Castro;418
Castilla León;León;Villaquejida;992
Castilla León;León;Villaquilambre;17013
Castilla León;León;Villarejo de Órbigo;3313
Castilla León;León;Villares de Órbigo;738
Castilla León;León;Villasabariego;1240
Castilla León;León;Villaselán;244
Castilla León;León;Villaturiel;1896
Castilla León;León;Villazala;844
Castilla León;León;Villazanzo de Valderaduey;549
Castilla León;León;Zotes del Páramo;495
Castilla León;Palencia;Abarca de Campos;41
Castilla León;Palencia;Abia de las Torres;176
Castilla León;Palencia;Aguilar de Campoo;7242
Castilla León;Palencia;Alar del Rey;1045
Castilla León;Palencia;Alba de Cerrato;92
Castilla León;Palencia;Amayuelas de Arriba;37
Castilla León;Palencia;Ampudia;590
Castilla León;Palencia;Amusco;456
Castilla León;Palencia;Antigüedad;407
Castilla León;Palencia;Arconada;49
Castilla León;Palencia;Astudillo;1134
Castilla León;Palencia;Autilla del Pino;240
Castilla León;Palencia;Autillo de Campos;168
Castilla León;Palencia;Ayuela;65
Castilla León;Palencia;Baltanás;1353
Castilla León;Palencia;Baquerín de Campos;37
Castilla León;Palencia;Bárcena de Campos;54
Castilla León;Palencia;Barruelo de Santullán;1488
Castilla León;Palencia;Báscones de Ojeda;174
Castilla León;Palencia;Becerril de Campos;962
Castilla León;Palencia;Belmonte de Campos;35
Castilla León;Palencia;Berzosilla;49
Castilla León;Palencia;Boada de Campos;20
Castilla León;Palencia;Boadilla de Rioseco;133
Castilla León;Palencia;Boadilla del Camino;130
Castilla León;Palencia;Brañosera;259
Castilla León;Palencia;Buenavista de Valdavia;386
Castilla León;Palencia;Bustillo de la Vega;322
Castilla León;Palencia;Bustillo del Páramo de Carrión;72
Castilla León;Palencia;Calahorra de Boedo;109
Castilla León;Palencia;Calzada de los Molinos;357
Castilla León;Palencia;Capillas;99
Castilla León;Palencia;Cardeñosa de Volpejera;39
Castilla León;Palencia;Carrión de los Condes;2302
Castilla León;Palencia;Castil de Vela;79
Castilla León;Palencia;Castrejón de la Peña;486
Castilla León;Palencia;Castrillo de Don Juan;271
Castilla León;Palencia;Castrillo de Onielo;122
Castilla León;Palencia;Castrillo de Villavega;202
Castilla León;Palencia;Castromocho;242
Castilla León;Palencia;Cervatos de la Cueza;311
Castilla León;Palencia;Cervera de Pisuerga;2566
Castilla León;Palencia;Cevico de la Torre;523
Castilla León;Palencia;Cevico Navero;234
Castilla León;Palencia;Cisneros;502
Castilla León;Palencia;Cobos de Cerrato;182
Castilla León;Palencia;Collazos de Boedo;130
Castilla León;Palencia;Congosto de Valdavia;201
Castilla León;Palencia;Cordovilla la Real;110
Castilla León;Palencia;Cubillas de Cerrato;80
Castilla León;Palencia;Dehesa de Montejo;154
Castilla León;Palencia;Dehesa de Romanos;37
Castilla León;Palencia;Dueñas;2994
Castilla León;Palencia;Espinosa de Cerrato;193
Castilla León;Palencia;Espinosa de Villagonzalo;211
Castilla León;Palencia;Frechilla;208
Castilla León;Palencia;Fresno del Río;197
Castilla León;Palencia;Frómista;822
Castilla León;Palencia;Fuentes de Nava;729
Castilla León;Palencia;Fuentes de Valdepero;261
Castilla León;Palencia;Grijota;1579
Castilla León;Palencia;Guardo;7400
Castilla León;Palencia;Guaza de Campos;62
Castilla León;Palencia;Hérmedes de Cerrato;100
Castilla León;Palencia;Herrera de Pisuerga;2379
Castilla León;Palencia;Herrera de Valdecañas;158
Castilla León;Palencia;Hontoria de Cerrato;105
Castilla León;Palencia;Hornillos de Cerrato;116
Castilla León;Palencia;Husillos;233
Castilla León;Palencia;Itero de la Vega;179
Castilla León;Palencia;Lagartos;145
Castilla León;Palencia;Lantadilla;371
Castilla León;Palencia;Ledigos;81
Castilla León;Palencia;Loma de Ucieza;272
Castilla León;Palencia;Lomas;54
Castilla León;Palencia;Magaz de Pisuerga;1021
Castilla León;Palencia;Manquillos;68
Castilla León;Palencia;Mantinos;149
Castilla León;Palencia;Marcilla de Campos;48
Castilla León;Palencia;Mazariegos;254
Castilla León;Palencia;Mazuecos de Valdeginate;113
Castilla León;Palencia;Melgar de Yuso;312
Castilla León;Palencia;Meneses de Campos;136
Castilla León;Palencia;Micieces de Ojeda;90
Castilla León;Palencia;Monzón de Campos;665
Castilla León;Palencia;Moratinos;72
Castilla León;Palencia;Mudá;105
Castilla León;Palencia;Nogal de las Huertas;47
Castilla León;Palencia;Olea de Boedo;39
Castilla León;Palencia;Olmos de Ojeda;265
Castilla León;Palencia;Osornillo;80
Castilla León;Palencia;Osorno la Mayor;1482
Castilla León;Palencia;Palencia;82651
Castilla León;Palencia;Palenzuela;254
Castilla León;Palencia;Páramo de Boedo;97
Castilla León;Palencia;Paredes de Nava;2131
Castilla León;Palencia;Payo de Ojeda;75
Castilla León;Palencia;Pedraza de Campos;95
Castilla León;Palencia;Pedrosa de la Vega;355
Castilla León;Palencia;Perales;153
Castilla León;Palencia;Pernía (La);400
Castilla León;Palencia;Piña de Campos;259
Castilla León;Palencia;Pino del Río;233
Castilla León;Palencia;Población de Arroyo;77
Castilla León;Palencia;Población de Campos;147
Castilla León;Palencia;Población de Cerrato;121
Castilla León;Palencia;Polentinos;74
Castilla León;Palencia;Pomar de Valdivia;504
Castilla León;Palencia;Poza de la Vega;240
Castilla León;Palencia;Pozo de Urama;35
Castilla León;Palencia;Prádanos de Ojeda;211
Castilla León;Palencia;Puebla de Valdavia (La);117
Castilla León;Palencia;Quintana del Puente;237
Castilla León;Palencia;Quintanilla de Onsoña;208
Castilla León;Palencia;Reinoso de Cerrato;59
Castilla León;Palencia;Renedo de la Vega;231
Castilla León;Palencia;Requena de Campos;28
Castilla León;Palencia;Respenda de la Peña;201
Castilla León;Palencia;Revenga de Campos;156
Castilla León;Palencia;Revilla de Collazos;79
Castilla León;Palencia;Ribas de Campos;175
Castilla León;Palencia;Riberos de la Cueza;68
Castilla León;Palencia;Saldaña;3097
Castilla León;Palencia;Salinas de Pisuerga;363
Castilla León;Palencia;San Cebrián de Campos;475
Castilla León;Palencia;San Cebrián de Mudá;173
Castilla León;Palencia;San Cristóbal de Boedo;27
Castilla León;Palencia;San Mamés de Campos;69
Castilla León;Palencia;San Román de la Cuba;91
Castilla León;Palencia;Santa Cecilia del Alcor;142
Castilla León;Palencia;Santa Cruz de Boedo;71
Castilla León;Palencia;Santervás de la Vega;522
Castilla León;Palencia;Santibáñez de Ecla;79
Castilla León;Palencia;Santibáñez de la Peña;1266
Castilla León;Palencia;Santoyo;250
Castilla León;Palencia;Serna (La);119
Castilla León;Palencia;Soto de Cerrato;191
Castilla León;Palencia;Sotobañado y Priorato;172
Castilla León;Palencia;Tabanera de Cerrato;124
Castilla León;Palencia;Tabanera de Valdavia;39
Castilla León;Palencia;Támara de Campos;93
Castilla León;Palencia;Tariego de Cerrato;524
Castilla León;Palencia;Torquemada;1049
Castilla León;Palencia;Torremormojón;57
Castilla León;Palencia;Triollo;71
Castilla León;Palencia;Valbuena de Pisuerga;60
Castilla León;Palencia;Valde-Ucieza;110
Castilla León;Palencia;Valdeolmillos;70
Castilla León;Palencia;Valderrábano;59
Castilla León;Palencia;Valle de Cerrato;99
Castilla León;Palencia;Valle del Retortillo;174
Castilla León;Palencia;Velilla del Río Carrión;1521
Castilla León;Palencia;Venta de Baños;6437
Castilla León;Palencia;Vertavillo;204
Castilla León;Palencia;Vid de Ojeda (La);120
Castilla León;Palencia;Villabasta de Valdavia;34
Castilla León;Palencia;Villacidaler;56
Castilla León;Palencia;Villaconancio;71
Castilla León;Palencia;Villada;1090
Castilla León;Palencia;Villaeles de Valdavia;71
Castilla León;Palencia;Villahán;116
Castilla León;Palencia;Villaherreros;239
Castilla León;Palencia;Villalaco;70
Castilla León;Palencia;Villalba de Guardo;209
Castilla León;Palencia;Villalcázar de Sirga;195
Castilla León;Palencia;Villalcón;71
Castilla León;Palencia;Villalobón;1227
Castilla León;Palencia;Villaluenga de la Vega;607
Castilla León;Palencia;Villamartín de Campos;168
Castilla León;Palencia;Villamediana;196
Castilla León;Palencia;Villameriel;132
Castilla León;Palencia;Villamoronta;291
Castilla León;Palencia;Villamuera de la Cueza;60
Castilla León;Palencia;Villamuriel de Cerrato;6177
Castilla León;Palencia;Villanueva del Rebollar;101
Castilla León;Palencia;Villanuño de Valdavia;106
Castilla León;Palencia;Villaprovedo;76
Castilla León;Palencia;Villarmentero de Campos;13
Castilla León;Palencia;Villarrabé;260
Castilla León;Palencia;Villarramiel;961
Castilla León;Palencia;Villasarracino;184
Castilla León;Palencia;Villasila de Valdavia;72
Castilla León;Palencia;Villaturde;201
Castilla León;Palencia;Villaumbrales;777
Castilla León;Palencia;Villaviudas;383
Castilla León;Palencia;Villerías de Campos;112
Castilla León;Palencia;Villodre;24
Castilla León;Palencia;Villodrigo;141
Castilla León;Palencia;Villoldo;417
Castilla León;Palencia;Villota del Páramo;368
Castilla León;Palencia;Villovieco;92
Castilla León;Salamanca;Abusejo;236
Castilla León;Salamanca;Agallas;164
Castilla León;Salamanca;Ahigal de los Aceiteros;159
Castilla León;Salamanca;Ahigal de Villarino;43
Castilla León;Salamanca;Alameda de Gardón (La);106
Castilla León;Salamanca;Alamedilla (La);199
Castilla León;Salamanca;Alaraz;551
Castilla León;Salamanca;Alba de Tormes;5331
Castilla León;Salamanca;Alba de Yeltes;250
Castilla León;Salamanca;Alberca (La);1224
Castilla León;Salamanca;Alberguería de Argañán (La);161
Castilla León;Salamanca;Alconada;177
Castilla León;Salamanca;Aldea del Obispo;332
Castilla León;Salamanca;Aldeacipreste;148
Castilla León;Salamanca;Aldeadávila de la Ribera;1395
Castilla León;Salamanca;Aldealengua;649
Castilla León;Salamanca;Aldeanueva de Figueroa;310
Castilla León;Salamanca;Aldeanueva de la Sierra;105
Castilla León;Salamanca;Aldearrodrigo;169
Castilla León;Salamanca;Aldearrubia;526
Castilla León;Salamanca;Aldeaseca de Alba;94
Castilla León;Salamanca;Aldeaseca de la Frontera;332
Castilla León;Salamanca;Aldeatejada;1290
Castilla León;Salamanca;Aldeavieja de Tormes;114
Castilla León;Salamanca;Aldehuela de la Bóveda;327
Castilla León;Salamanca;Aldehuela de Yeltes;234
Castilla León;Salamanca;Almenara de Tormes;306
Castilla León;Salamanca;Almendra;187
Castilla León;Salamanca;Anaya de Alba;254
Castilla León;Salamanca;Añover de Tormes;101
Castilla León;Salamanca;Arabayona de Mógica;451
Castilla León;Salamanca;Arapiles;548
Castilla León;Salamanca;Arcediano;92
Castilla León;Salamanca;Arco (El);104
Castilla León;Salamanca;Armenteros;558
Castilla León;Salamanca;Atalaya (La);144
Castilla León;Salamanca;Babilafuente;934
Castilla León;Salamanca;Bañobárez;359
Castilla León;Salamanca;Barbadillo;476
Castilla León;Salamanca;Barbalos;94
Castilla León;Salamanca;Barceo;54
Castilla León;Salamanca;Barruecopardo;501
Castilla León;Salamanca;Bastida (La);35
Castilla León;Salamanca;Béjar;15007
Castilla León;Salamanca;Beleña;179
Castilla León;Salamanca;Bermellar;169
Castilla León;Salamanca;Berrocal de Huebra;81
Castilla León;Salamanca;Berrocal de Salvatierra;97
Castilla León;Salamanca;Boada;323
Castilla León;Salamanca;Bodón (El);327
Castilla León;Salamanca;Bogajo;166
Castilla León;Salamanca;Bouza (La);64
Castilla León;Salamanca;Bóveda del Río Almar;260
Castilla León;Salamanca;Brincones;74
Castilla León;Salamanca;Buenamadre;151
Castilla León;Salamanca;Buenavista;192
Castilla León;Salamanca;Cabaco (El);285
Castilla León;Salamanca;Cabeza de Béjar (La);85
Castilla León;Salamanca;Cabeza del Caballo;413
Castilla León;Salamanca;Cabezabellosa de la Calzada;104
Castilla León;Salamanca;Cabrerizos;3773
Castilla León;Salamanca;Cabrillas;457
Castilla León;Salamanca;Calvarrasa de Abajo;1092
Castilla León;Salamanca;Calvarrasa de Arriba;650
Castilla León;Salamanca;Calzada de Béjar (La);94
Castilla León;Salamanca;Calzada de Don Diego;207
Castilla León;Salamanca;Calzada de Valdunciel;642
Castilla León;Salamanca;Campillo de Azaba;199
Castilla León;Salamanca;Campo de Peñaranda (El);317
Castilla León;Salamanca;Candelario;981
Castilla León;Salamanca;Canillas de Abajo;94
Castilla León;Salamanca;Cantagallo;267
Castilla León;Salamanca;Cantalapiedra;1130
Castilla León;Salamanca;Cantalpino;1025
Castilla León;Salamanca;Cantaracillo;225
Castilla León;Salamanca;Carbajosa de la Sagrada;5623
Castilla León;Salamanca;Carpio de Azaba;115
Castilla León;Salamanca;Carrascal de Barregas;869
Castilla León;Salamanca;Carrascal del Obispo;240
Castilla León;Salamanca;Casafranca;78
Castilla León;Salamanca;Casas del Conde (Las);67
Castilla León;Salamanca;Casillas de Flores;228
Castilla León;Salamanca;Castellanos de Moriscos;1424
Castilla León;Salamanca;Castellanos de Villiquera;692
Castilla León;Salamanca;Castillejo de Martín Viejo;279
Castilla León;Salamanca;Castraz;58
Castilla León;Salamanca;Cepeda;412
Castilla León;Salamanca;Cereceda de la Sierra;111
Castilla León;Salamanca;Cerezal de Peñahorcada;96
Castilla León;Salamanca;Cerralbo;223
Castilla León;Salamanca;Cerro (El);500
Castilla León;Salamanca;Cespedosa de Tormes;579
Castilla León;Salamanca;Chagarcía Medianero;109
Castilla León;Salamanca;Cilleros de la Bastida;35
Castilla León;Salamanca;Cipérez;328
Castilla León;Salamanca;Ciudad Rodrigo;14080
Castilla León;Salamanca;Coca de Alba;124
Castilla León;Salamanca;Colmenar de Montemayor;211
Castilla León;Salamanca;Cordovilla;128
Castilla León;Salamanca;Cristóbal;200
Castilla León;Salamanca;Cubo de Don Sancho (El);502
Castilla León;Salamanca;Dios le Guarde;165
Castilla León;Salamanca;Doñinos de Ledesma;81
Castilla León;Salamanca;Doñinos de Salamanca;1493
Castilla León;Salamanca;Ejeme;163
Castilla León;Salamanca;Encina (La);139
Castilla León;Salamanca;Encina de San Silvestre;124
Castilla León;Salamanca;Encinas de Abajo;624
Castilla León;Salamanca;Encinas de Arriba;261
Castilla León;Salamanca;Encinasola de los Comendadores;230
Castilla León;Salamanca;Endrinal;264
Castilla León;Salamanca;Escurial de la Sierra;276
Castilla León;Salamanca;Espadaña;41
Castilla León;Salamanca;Espeja;281
Castilla León;Salamanca;Espino de la Orbada;302
Castilla León;Salamanca;Florida de Liébana;283
Castilla León;Salamanca;Forfoleda;209
Castilla León;Salamanca;Frades de la Sierra;230
Castilla León;Salamanca;Fregeneda (La);445
Castilla León;Salamanca;Fresnedoso;117
Castilla León;Salamanca;Fresno Alhándiga;276
Castilla León;Salamanca;Fuente de San Esteban (La);1447
Castilla León;Salamanca;Fuenteguinaldo;803
Castilla León;Salamanca;Fuenteliante;132
Castilla León;Salamanca;Fuenterroble de Salvatierra;270
Castilla León;Salamanca;Fuentes de Béjar;248
Castilla León;Salamanca;Fuentes de Oñoro;1317
Castilla León;Salamanca;Gajates;177
Castilla León;Salamanca;Galindo y Perahuy;710
Castilla León;Salamanca;Galinduste;500
Castilla León;Salamanca;Galisancho;437
Castilla León;Salamanca;Gallegos de Argañán;338
Castilla León;Salamanca;Gallegos de Solmirón;155
Castilla León;Salamanca;Garcibuey;218
Castilla León;Salamanca;Garcihernández;541
Castilla León;Salamanca;Garcirrey;87
Castilla León;Salamanca;Gejuelo del Barro;45
Castilla León;Salamanca;Golpejas;175
Castilla León;Salamanca;Gomecello;594
Castilla León;Salamanca;Guadramiro;170
Castilla León;Salamanca;Guijo de Ávila;104
Castilla León;Salamanca;Guijuelo;5971
Castilla León;Salamanca;Herguijuela de Ciudad Rodrigo;109
Castilla León;Salamanca;Herguijuela de la Sierra;300
Castilla León;Salamanca;Herguijuela del Campo;108
Castilla León;Salamanca;Hinojosa de Duero;747
Castilla León;Salamanca;Horcajo de Montemayor;170
Castilla León;Salamanca;Horcajo Medianero;280
Castilla León;Salamanca;Hoya (La);32
Castilla León;Salamanca;Huerta;313
Castilla León;Salamanca;Iruelos;42
Castilla León;Salamanca;Ituero de Azaba;239
Castilla León;Salamanca;Juzbado;170
Castilla León;Salamanca;Lagunilla;506
Castilla León;Salamanca;Larrodrigo;236
Castilla León;Salamanca;Ledesma;1922
Castilla León;Salamanca;Ledrada;573
Castilla León;Salamanca;Linares de Riofrío;988
Castilla León;Salamanca;Lumbrales;1949
Castilla León;Salamanca;Machacón;501
Castilla León;Salamanca;Macotera;1364
Castilla León;Salamanca;Madroñal;156
Castilla León;Salamanca;Maíllo (El);348
Castilla León;Salamanca;Malpartida;113
Castilla León;Salamanca;Mancera de Abajo;263
Castilla León;Salamanca;Manzano (El);83
Castilla León;Salamanca;Martiago;329
Castilla León;Salamanca;Martín de Yeltes;475
Castilla León;Salamanca;Martinamor;96
Castilla León;Salamanca;Masueco;379
Castilla León;Salamanca;Mata de Ledesma (La);123
Castilla León;Salamanca;Matilla de los Caños del Río;658
Castilla León;Salamanca;Maya (La);209
Castilla León;Salamanca;Membribe de la Sierra;145
Castilla León;Salamanca;Mieza;265
Castilla León;Salamanca;Milano (El);134
Castilla León;Salamanca;Miranda de Azán;447
Castilla León;Salamanca;Miranda del Castañar;522
Castilla León;Salamanca;Mogarraz;314
Castilla León;Salamanca;Molinillo;55
Castilla León;Salamanca;Monforte de la Sierra;96
Castilla León;Salamanca;Monleón;107
Castilla León;Salamanca;Monleras;263
Castilla León;Salamanca;Monsagro;178
Castilla León;Salamanca;Montejo;236
Castilla León;Salamanca;Montemayor del Río;304
Castilla León;Salamanca;Monterrubio de Armuña;1179
Castilla León;Salamanca;Monterrubio de la Sierra;163
Castilla León;Salamanca;Morasverdes;334
Castilla León;Salamanca;Morille;249
Castilla León;Salamanca;Moríñigo;119
Castilla León;Salamanca;Moriscos;163
Castilla León;Salamanca;Moronta;105
Castilla León;Salamanca;Mozárbez;468
Castilla León;Salamanca;Narros de Matalayegua;245
Castilla León;Salamanca;Nava de Béjar;110
Castilla León;Salamanca;Nava de Francia;144
Castilla León;Salamanca;Nava de Sotrobal;194
Castilla León;Salamanca;Navacarros;130
Castilla León;Salamanca;Navales;348
Castilla León;Salamanca;Navalmoral de Béjar;54
Castilla León;Salamanca;Navamorales;95
Castilla León;Salamanca;Navarredonda de la Rinconada;217
Castilla León;Salamanca;Navasfrías;523
Castilla León;Salamanca;Negrilla de Palencia;136
Castilla León;Salamanca;Olmedo de Camaces;137
Castilla León;Salamanca;Orbada (La);247
Castilla León;Salamanca;Pajares de la Laguna;139
Castilla León;Salamanca;Palacios del Arzobispo;193
Castilla León;Salamanca;Palaciosrubios;459
Castilla León;Salamanca;Palencia de Negrilla;182
Castilla León;Salamanca;Parada de Arriba;285
Castilla León;Salamanca;Parada de Rubiales;324
Castilla León;Salamanca;Paradinas de San Juan;501
Castilla León;Salamanca;Pastores;68
Castilla León;Salamanca;Payo (El);405
Castilla León;Salamanca;Pedraza de Alba;259
Castilla León;Salamanca;Pedrosillo de Alba;178
Castilla León;Salamanca;Pedrosillo de los Aires;387
Castilla León;Salamanca;Pedrosillo el Ralo;137
Castilla León;Salamanca;Pedroso de la Armuña (El);260
Castilla León;Salamanca;Pelabravo;959
Castilla León;Salamanca;Pelarrodríguez;184
Castilla León;Salamanca;Pelayos;120
Castilla León;Salamanca;Peña (La);141
Castilla León;Salamanca;Peñacaballera;171
Castilla León;Salamanca;Peñaparda;418
Castilla León;Salamanca;Peñaranda de Bracamonte;6769
Castilla León;Salamanca;Peñarandilla;239
Castilla León;Salamanca;Peralejos de Abajo;183
Castilla León;Salamanca;Peralejos de Arriba;50
Castilla León;Salamanca;Pereña de la Ribera;406
Castilla León;Salamanca;Peromingo;150
Castilla León;Salamanca;Pinedas;151
Castilla León;Salamanca;Pino de Tormes (El);155
Castilla León;Salamanca;Pitiegua;218
Castilla León;Salamanca;Pizarral;80
Castilla León;Salamanca;Poveda de las Cintas;274
Castilla León;Salamanca;Pozos de Hinojo;60
Castilla León;Salamanca;Puebla de Azaba;216
Castilla León;Salamanca;Puebla de San Medel;46
Castilla León;Salamanca;Puebla de Yeltes;183
Castilla León;Salamanca;Puente del Congosto;273
Castilla León;Salamanca;Puertas;83
Castilla León;Salamanca;Puerto de Béjar;395
Castilla León;Salamanca;Puerto Seguro;86
Castilla León;Salamanca;Rágama;256
Castilla León;Salamanca;Redonda (La);94
Castilla León;Salamanca;Retortillo;246
Castilla León;Salamanca;Rinconada de la Sierra (La);151
Castilla León;Salamanca;Robleda;521
Castilla León;Salamanca;Robliza de Cojos;233
Castilla León;Salamanca;Rollán;484
Castilla León;Salamanca;Saelices el Chico;157
Castilla León;Salamanca;Sagrada (La);146
Castilla León;Salamanca;Sahugo (El);240
Castilla León;Salamanca;Salamanca;155619
Castilla León;Salamanca;Saldeana;143
Castilla León;Salamanca;Salmoral;241
Castilla León;Salamanca;Salvatierra de Tormes;63
Castilla León;Salamanca;San Cristóbal de la Cuesta;816
Castilla León;Salamanca;San Esteban de la Sierra;363
Castilla León;Salamanca;San Felices de los Gallegos;536
Castilla León;Salamanca;San Martín del Castañar;293
Castilla León;Salamanca;San Miguel de Valero;383
Castilla León;Salamanca;San Miguel del Robledo;81
Castilla León;Salamanca;San Morales;261
Castilla León;Salamanca;San Muñoz;287
Castilla León;Salamanca;San Pedro de Rozados;334
Castilla León;Salamanca;San Pedro del Valle;140
Castilla León;Salamanca;San Pelayo de Guareña;108
Castilla León;Salamanca;Sanchón de la Ribera;94
Castilla León;Salamanca;Sanchón de la Sagrada;41
Castilla León;Salamanca;Sanchotello;248
Castilla León;Salamanca;Sancti-Spíritus;930
Castilla León;Salamanca;Sando;152
Castilla León;Salamanca;Santa María de Sando;135
Castilla León;Salamanca;Santa Marta de Tormes;14630
Castilla León;Salamanca;Santiago de la Puebla;437
Castilla León;Salamanca;Santibáñez de Béjar;554
Castilla León;Salamanca;Santibáñez de la Sierra;233
Castilla León;Salamanca;Santiz;269
Castilla León;Salamanca;Santos (Los);672
Castilla León;Salamanca;Sardón de los Frailes;101
Castilla León;Salamanca;Saucelle;374
Castilla León;Salamanca;Sepulcro-Hilario;212
Castilla León;Salamanca;Sequeros;234
Castilla León;Salamanca;Serradilla del Arroyo;364
Castilla León;Salamanca;Serradilla del Llano;182
Castilla León;Salamanca;Sierpe (La);49
Castilla León;Salamanca;Sieteiglesias de Tormes;178
Castilla León;Salamanca;Sobradillo;284
Castilla León;Salamanca;Sorihuela;345
Castilla León;Salamanca;Sotoserrano;671
Castilla León;Salamanca;Tabera de Abajo;112
Castilla León;Salamanca;Tala (La);117
Castilla León;Salamanca;Tamames;979
Castilla León;Salamanca;Tarazona de Guareña;369
Castilla León;Salamanca;Tardáguila;233
Castilla León;Salamanca;Tejado (El);139
Castilla León;Salamanca;Tejeda y Segoyuela;110
Castilla León;Salamanca;Tenebrón;176
Castilla León;Salamanca;Terradillos;3438
Castilla León;Salamanca;Topas;642
Castilla León;Salamanca;Tordillos;468
Castilla León;Salamanca;Tornadizo (El);117
Castilla León;Salamanca;Torresmenudas;203
Castilla León;Salamanca;Trabanca;243
Castilla León;Salamanca;Tremedal de Tormes;38
Castilla León;Salamanca;Valdecarros;391
Castilla León;Salamanca;Valdefuentes de Sangusín;274
Castilla León;Salamanca;Valdehijaderos;92
Castilla León;Salamanca;Valdelacasa;284
Castilla León;Salamanca;Valdelageve;96
Castilla León;Salamanca;Valdelosa;496
Castilla León;Salamanca;Valdemierque;59
Castilla León;Salamanca;Valderrodrigo;166
Castilla León;Salamanca;Valdunciel;105
Castilla León;Salamanca;Valero;380
Castilla León;Salamanca;Vallejera de Riofrío;68
Castilla León;Salamanca;Valsalabroso;173
Castilla León;Salamanca;Valverde de Valdelacasa;85
Castilla León;Salamanca;Valverdón;264
Castilla León;Salamanca;Vecinos;325
Castilla León;Salamanca;Vega de Tirados;209
Castilla León;Salamanca;Veguillas (Las);289
Castilla León;Salamanca;Vellés (La);565
Castilla León;Salamanca;Ventosa del Río Almar;133
Castilla León;Salamanca;Vídola (La);153
Castilla León;Salamanca;Villaflores;348
Castilla León;Salamanca;Villagonzalo de Tormes;208
Castilla León;Salamanca;Villalba de los Llanos;167
Castilla León;Salamanca;Villamayor;6251
Castilla León;Salamanca;Villanueva del Conde;210
Castilla León;Salamanca;Villar de Argañán;94
Castilla León;Salamanca;Villar de Ciervo;327
Castilla León;Salamanca;Villar de Gallimazo;177
Castilla León;Salamanca;Villar de la Yegua;215
Castilla León;Salamanca;Villar de Peralonso;306
Castilla León;Salamanca;Villar de Samaniego;108
Castilla León;Salamanca;Villares de la Reina;5509
Castilla León;Salamanca;Villares de Yeltes;137
Castilla León;Salamanca;Villarino de los Aires;961
Castilla León;Salamanca;Villarmayor;211
Castilla León;Salamanca;Villarmuerto;47
Castilla León;Salamanca;Villasbuenas;242
Castilla León;Salamanca;Villasdardo;18
Castilla León;Salamanca;Villaseco de los Gamitos;179
Castilla León;Salamanca;Villaseco de los Reyes;397
Castilla León;Salamanca;Villasrubias;259
Castilla León;Salamanca;Villaverde de Guareña;175
Castilla León;Salamanca;Villavieja de Yeltes;939
Castilla León;Salamanca;Villoria;1442
Castilla León;Salamanca;Villoruela;954
Castilla León;Salamanca;Vilvestre;493
Castilla León;Salamanca;Vitigudino;2887
Castilla León;Salamanca;Yecla de Yeltes;305
Castilla León;Salamanca;Zamarra;125
Castilla León;Salamanca;Zamayón;181
Castilla León;Salamanca;Zarapicos;69
Castilla León;Salamanca;Zarza de Pumareda (La);157
Castilla León;Salamanca;Zorita de la Frontera;232
Castilla León;Segovia;Abades;906
Castilla León;Segovia;Adrada de Pirón;50
Castilla León;Segovia;Adrados;168
Castilla León;Segovia;Aguilafuente;721
Castilla León;Segovia;Alconada de Maderuelo;41
Castilla León;Segovia;Aldea Real;353
Castilla León;Segovia;Aldealcorvo;28
Castilla León;Segovia;Aldealengua de Pedraza;100
Castilla León;Segovia;Aldealengua de Santa María;77
Castilla León;Segovia;Aldeanueva de la Serrezuela;56
Castilla León;Segovia;Aldeanueva del Codonal;161
Castilla León;Segovia;Aldeasoña;74
Castilla León;Segovia;Aldehorno;60
Castilla León;Segovia;Aldehuela del Codonal;35
Castilla León;Segovia;Aldeonte;73
Castilla León;Segovia;Anaya;140
Castilla León;Segovia;Añe;115
Castilla León;Segovia;Arahuetes;51
Castilla León;Segovia;Arcones;243
Castilla León;Segovia;Arevalillo de Cega;37
Castilla León;Segovia;Armuña;229
Castilla León;Segovia;Ayllón;1429
Castilla León;Segovia;Barbolla;205
Castilla León;Segovia;Basardilla;167
Castilla León;Segovia;Bercial;120
Castilla León;Segovia;Bercimuel;57
Castilla León;Segovia;Bernardos;596
Castilla León;Segovia;Bernuy de Porreros;630
Castilla León;Segovia;Boceguillas;739
Castilla León;Segovia;Brieva;76
Castilla León;Segovia;Caballar;94
Castilla León;Segovia;Cabañas de Polendos;147
Castilla León;Segovia;Cabezuela;729
Castilla León;Segovia;Calabazas de Fuentidueña;44
Castilla León;Segovia;Campo de San Pedro;375
Castilla León;Segovia;Cantalejo;3997
Castilla León;Segovia;Cantimpalos;1424
Castilla León;Segovia;Carbonero el Mayor;2569
Castilla León;Segovia;Carrascal del Río;182
Castilla León;Segovia;Casla;165
Castilla León;Segovia;Castillejo de Mesleón;170
Castilla León;Segovia;Castro de Fuentidueña;56
Castilla León;Segovia;Castrojimeno;37
Castilla León;Segovia;Castroserna de Abajo;59
Castilla León;Segovia;Castroserracín;55
Castilla León;Segovia;Cedillo de la Torre;120
Castilla León;Segovia;Cerezo de Abajo;171
Castilla León;Segovia;Cerezo de Arriba;198
Castilla León;Segovia;Chañe;818
Castilla León;Segovia;Cilleruelo de San Mamés;44
Castilla León;Segovia;Cobos de Fuentidueña;47
Castilla León;Segovia;Coca;2131
Castilla León;Segovia;Codorniz;412
Castilla León;Segovia;Collado Hermoso;165
Castilla León;Segovia;Condado de Castilnovo;114
Castilla León;Segovia;Corral de Ayllón;81
Castilla León;Segovia;Cozuelos de Fuentidueña;153
Castilla León;Segovia;Cubillo;57
Castilla León;Segovia;Cuéllar;9861
Castilla León;Segovia;Cuevas de Provanco;149
Castilla León;Segovia;Domingo García;41
Castilla León;Segovia;Donhierro;116
Castilla León;Segovia;Duruelo;164
Castilla León;Segovia;Encinas;57
Castilla León;Segovia;Encinillas;150
Castilla León;Segovia;Escalona del Prado;606
Castilla León;Segovia;Escarabajosa de Cabezas;350
Castilla León;Segovia;Escobar de Polendos;210
Castilla León;Segovia;Espinar (El);9535
Castilla León;Segovia;Espirdo;871
Castilla León;Segovia;Fresneda de Cuéllar;199
Castilla León;Segovia;Fresno de Cantespino;281
Castilla León;Segovia;Fresno de la Fuente;116
Castilla León;Segovia;Frumales;176
Castilla León;Segovia;Fuente de Santa Cruz;147
Castilla León;Segovia;Fuente el Olmo de Fuentidueña;113
Castilla León;Segovia;Fuente el Olmo de Íscar;86
Castilla León;Segovia;Fuentepelayo;983
Castilla León;Segovia;Fuentepiñel;122
Castilla León;Segovia;Fuenterrebollo;388
Castilla León;Segovia;Fuentesaúco de Fuentidueña;303
Castilla León;Segovia;Fuentesoto;178
Castilla León;Segovia;Fuentidueña;127
Castilla León;Segovia;Gallegos;98
Castilla León;Segovia;Garcillán;424
Castilla León;Segovia;Gomezserracín;720
Castilla León;Segovia;Grajera;182
Castilla León;Segovia;Honrubia de la Cuesta;73
Castilla León;Segovia;Hontalbilla;348
Castilla León;Segovia;Hontanares de Eresma;993
Castilla León;Segovia;Huertos (Los);165
Castilla León;Segovia;Ituero y Lama;313
Castilla León;Segovia;Juarros de Riomoros;78
Castilla León;Segovia;Juarros de Voltoya;265
Castilla León;Segovia;Labajos;150
Castilla León;Segovia;Laguna de Contreras;129
Castilla León;Segovia;Languilla;100
Castilla León;Segovia;Lastras de Cuéllar;460
Castilla León;Segovia;Lastras del Pozo;88
Castilla León;Segovia;Lastrilla (La);3269
Castilla León;Segovia;Losa (La);534
Castilla León;Segovia;Maderuelo;164
Castilla León;Segovia;Marazoleja;132
Castilla León;Segovia;Marazuela;57
Castilla León;Segovia;Martín Miguel;266
Castilla León;Segovia;Martín Muñoz de la Dehesa;197
Castilla León;Segovia;Martín Muñoz de las Posadas;373
Castilla León;Segovia;Marugán;634
Castilla León;Segovia;Mata de Cuéllar;303
Castilla León;Segovia;Matabuena;254
Castilla León;Segovia;Matilla (La);104
Castilla León;Segovia;Melque de Cercos;104
Castilla León;Segovia;Membibre de la Hoz;48
Castilla León;Segovia;Migueláñez;166
Castilla León;Segovia;Montejo de Arévalo;234
Castilla León;Segovia;Montejo de la Vega de la Serrezuela;170
Castilla León;Segovia;Monterrubio;70
Castilla León;Segovia;Moral de Hornuez;101
Castilla León;Segovia;Mozoncillo;1084
Castilla León;Segovia;Muñopedro;330
Castilla León;Segovia;Muñoveros;208
Castilla León;Segovia;Nava de la Asunción;3012
Castilla León;Segovia;Navafría;382
Castilla León;Segovia;Navalilla;137
Castilla León;Segovia;Navalmanzano;1185
Castilla León;Segovia;Navares de Ayuso;60
Castilla León;Segovia;Navares de Enmedio;118
Castilla León;Segovia;Navares de las Cuevas;28
Castilla León;Segovia;Navas de Oro;1483
Castilla León;Segovia;Navas de Riofrío;369
Castilla León;Segovia;Navas de San Antonio;403
Castilla León;Segovia;Nieva;348
Castilla León;Segovia;Olombrada;723
Castilla León;Segovia;Orejana;81
Castilla León;Segovia;Ortigosa de Pestaño;105
Castilla León;Segovia;Ortigosa del Monte;502
Castilla León;Segovia;Otero de Herreros;1009
Castilla León;Segovia;Pajarejos;36
Castilla León;Segovia;Palazuelos de Eresma;4044
Castilla León;Segovia;Pedraza;473
Castilla León;Segovia;Pelayos del Arroyo;59
Castilla León;Segovia;Perosillo;25
Castilla León;Segovia;Pinarejos;136
Castilla León;Segovia;Pinarnegrillo;142
Castilla León;Segovia;Pradales;53
Castilla León;Segovia;Prádena;590
Castilla León;Segovia;Puebla de Pedraza;73
Castilla León;Segovia;Rapariegos;244
Castilla León;Segovia;Rebollo;107
Castilla León;Segovia;Remondo;334
Castilla León;Segovia;Riaguas de San Bartolomé;48
Castilla León;Segovia;Riaza;2448
Castilla León;Segovia;Ribota;39
Castilla León;Segovia;Riofrío de Riaza;42
Castilla León;Segovia;Roda de Eresma;210
Castilla León;Segovia;Sacramenia;510
Castilla León;Segovia;Samboal;530
Castilla León;Segovia;San Cristóbal de Cuéllar;189
Castilla León;Segovia;San Cristóbal de la Vega;136
Castilla León;Segovia;San Cristóbal de Segovia;2908
Castilla León;Segovia;San Ildefonso;5725
Castilla León;Segovia;San Martín y Mudrián;342
Castilla León;Segovia;San Miguel de Bernuy;177
Castilla León;Segovia;San Pedro de Gaíllos;335
Castilla León;Segovia;Sanchonuño;936
Castilla León;Segovia;Sangarcía;429
Castilla León;Segovia;Santa María la Real de Nieva;1214
Castilla León;Segovia;Santa Marta del Cerro;58
Castilla León;Segovia;Santiuste de Pedraza;116
Castilla León;Segovia;Santiuste de San Juan Bautista;649
Castilla León;Segovia;Santo Domingo de Pirón;65
Castilla León;Segovia;Santo Tomé del Puerto;341
Castilla León;Segovia;Sauquillo de Cabezas;214
Castilla León;Segovia;Sebúlcor;283
Castilla León;Segovia;Segovia;56660
Castilla León;Segovia;Sepúlveda;1273
Castilla León;Segovia;Sequera de Fresno;58
Castilla León;Segovia;Sotillo;31
Castilla León;Segovia;Sotosalbos;130
Castilla León;Segovia;Tabanera la Luenga;81
Castilla León;Segovia;Tolocirio;53
Castilla León;Segovia;Torre Val de San Pedro;194
Castilla León;Segovia;Torreadrada;96
Castilla León;Segovia;Torrecaballeros;1154
Castilla León;Segovia;Torrecilla del Pinar;234
Castilla León;Segovia;Torreiglesias;356
Castilla León;Segovia;Trescasas;775
Castilla León;Segovia;Turégano;1088
Castilla León;Segovia;Urueñas;109
Castilla León;Segovia;Valdeprados;91
Castilla León;Segovia;Valdevacas de Montejo;31
Castilla León;Segovia;Valdevacas y Guijar;135
Castilla León;Segovia;Valle de Tabladillo;126
Castilla León;Segovia;Vallelado;801
Castilla León;Segovia;Valleruela de Pedraza;80
Castilla León;Segovia;Valleruela de Sepúlveda;61
Castilla León;Segovia;Valseca;306
Castilla León;Segovia;Valtiendas;146
Castilla León;Segovia;Valverde del Majano;975
Castilla León;Segovia;Veganzones;287
Castilla León;Segovia;Vegas de Matute;294
Castilla León;Segovia;Ventosilla y Tejadilla;38
Castilla León;Segovia;Villacastín;1639
Castilla León;Segovia;Villaverde de Íscar;737
Castilla León;Segovia;Villaverde de Montejo;47
Castilla León;Segovia;Villeguillo;183
Castilla León;Segovia;Yanguas de Eresma;165
Castilla León;Segovia;Zarzuela del Monte;613
Castilla León;Segovia;Zarzuela del Pinar;534
Castilla León;Soria;Abejar;383
Castilla León;Soria;Adradas;75
Castilla León;Soria;Ágreda;3293
Castilla León;Soria;Alconaba;177
Castilla León;Soria;Alcubilla de Avellaneda;168
Castilla León;Soria;Alcubilla de las Peñas;75
Castilla León;Soria;Aldealafuente;116
Castilla León;Soria;Aldealices;23
Castilla León;Soria;Aldealpozo;30
Castilla León;Soria;Aldealseñor;42
Castilla León;Soria;Aldehuela de Periáñez;53
Castilla León;Soria;Aldehuelas (Las);95
Castilla León;Soria;Alentisque;32
Castilla León;Soria;Aliud;28
Castilla León;Soria;Almajano;210
Castilla León;Soria;Almaluez;202
Castilla León;Soria;Almarza;655
Castilla León;Soria;Almazán;6006
Castilla León;Soria;Almazul;103
Castilla León;Soria;Almenar de Soria;298
Castilla León;Soria;Alpanseque;82
Castilla León;Soria;Arancón;99
Castilla León;Soria;Arcos de Jalón;1782
Castilla León;Soria;Arenillas;27
Castilla León;Soria;Arévalo de la Sierra;81
Castilla León;Soria;Ausejo de la Sierra;66
Castilla León;Soria;Baraona;187
Castilla León;Soria;Barca;109
Castilla León;Soria;Barcones;31
Castilla León;Soria;Bayubas de Abajo;210
Castilla León;Soria;Bayubas de Arriba;58
Castilla León;Soria;Beratón;37
Castilla León;Soria;Berlanga de Duero;1021
Castilla León;Soria;Blacos;56
Castilla León;Soria;Bliecos;43
Castilla León;Soria;Borjabad;45
Castilla León;Soria;Borobia;287
Castilla León;Soria;Buberos;41
Castilla León;Soria;Buitrago;52
Castilla León;Soria;Burgo de Osma-Ciudad de Osma;5258
Castilla León;Soria;Cabrejas del Campo;73
Castilla León;Soria;Cabrejas del Pinar;438
Castilla León;Soria;Calatañazor;70
Castilla León;Soria;Caltojar;86
Castilla León;Soria;Cañamaque;26
Castilla León;Soria;Candilichera;163
Castilla León;Soria;Carabantes;24
Castilla León;Soria;Caracena;24
Castilla León;Soria;Carrascosa de Abajo;31
Castilla León;Soria;Carrascosa de la Sierra;14
Castilla León;Soria;Casarejos;219
Castilla León;Soria;Castilfrío de la Sierra;38
Castilla León;Soria;Castillejo de Robledo;146
Castilla León;Soria;Castilruiz;221
Castilla León;Soria;Centenera de Andaluz;23
Castilla León;Soria;Cerbón;37
Castilla León;Soria;Cidones;367
Castilla León;Soria;Cigudosa;45
Castilla León;Soria;Cihuela;74
Castilla León;Soria;Ciria;102
Castilla León;Soria;Cirujales del Río;29
Castilla León;Soria;Coscurita;115
Castilla León;Soria;Covaleda;1919
Castilla León;Soria;Cubilla;57
Castilla León;Soria;Cubo de la Solana;212
Castilla León;Soria;Cueva de Ágreda;88
Castilla León;Soria;Dévanos;100
Castilla León;Soria;Deza;280
Castilla León;Soria;Duruelo de la Sierra;1313
Castilla León;Soria;Escobosa de Almazán;36
Castilla León;Soria;Espeja de San Marcelino;196
Castilla León;Soria;Espejón;200
Castilla León;Soria;Estepa de San Juan;10
Castilla León;Soria;Frechilla de Almazán;29
Castilla León;Soria;Fresno de Caracena;29
Castilla León;Soria;Fuentearmegil;247
Castilla León;Soria;Fuentecambrón;48
Castilla León;Soria;Fuentecantos;56
Castilla León;Soria;Fuentelmonge;87
Castilla León;Soria;Fuentelsaz de Soria;60
Castilla León;Soria;Fuentepinilla;113
Castilla León;Soria;Fuentes de Magaña;79
Castilla León;Soria;Fuentestrún;56
Castilla León;Soria;Garray;576
Castilla León;Soria;Golmayo;1924
Castilla León;Soria;Gómara;408
Castilla León;Soria;Gormaz;20
Castilla León;Soria;Herrera de Soria;12
Castilla León;Soria;Hinojosa del Campo;33
Castilla León;Soria;Langa de Duero;833
Castilla León;Soria;Liceras;55
Castilla León;Soria;Losilla (La);12
Castilla León;Soria;Magaña;101
Castilla León;Soria;Maján;17
Castilla León;Soria;Matalebreras;95
Castilla León;Soria;Matamala de Almazán;362
Castilla León;Soria;Medinaceli;804
Castilla León;Soria;Miño de Medinaceli;82
Castilla León;Soria;Miño de San Esteban;68
Castilla León;Soria;Molinos de Duero;184
Castilla León;Soria;Momblona;31
Castilla León;Soria;Monteagudo de las Vicarías;239
Castilla León;Soria;Montejo de Tiermes;209
Castilla León;Soria;Montenegro de Cameros;96
Castilla León;Soria;Morón de Almazán;242
Castilla León;Soria;Muriel de la Fuente;81
Castilla León;Soria;Muriel Viejo;72
Castilla León;Soria;Nafría de Ucero;58
Castilla León;Soria;Narros;43
Castilla León;Soria;Navaleno;939
Castilla León;Soria;Nepas;79
Castilla León;Soria;Nolay;70
Castilla León;Soria;Noviercas;194
Castilla León;Soria;Ólvega;3749
Castilla León;Soria;Oncala;94
Castilla León;Soria;Pinilla del Campo;21
Castilla León;Soria;Portillo de Soria;18
Castilla León;Soria;Póveda de Soria (La);124
Castilla León;Soria;Pozalmuro;80
Castilla León;Soria;Quiñonería;14
Castilla León;Soria;Quintana Redonda;536
Castilla León;Soria;Quintanas de Gormaz;156
Castilla León;Soria;Rábanos (Los);541
Castilla León;Soria;Rebollar;46
Castilla León;Soria;Recuerda;89
Castilla León;Soria;Rello;26
Castilla León;Soria;Renieblas;114
Castilla León;Soria;Retortillo de Soria;198
Castilla León;Soria;Reznos;38
Castilla León;Soria;Riba de Escalote (La);20
Castilla León;Soria;Rioseco de Soria;138
Castilla León;Soria;Rollamienta;43
Castilla León;Soria;Royo (El);321
Castilla León;Soria;Salduero;182
Castilla León;Soria;San Esteban de Gormaz;3314
Castilla León;Soria;San Felices;66
Castilla León;Soria;San Leonardo de Yagüe;2340
Castilla León;Soria;San Pedro Manrique;626
Castilla León;Soria;Santa Cruz de Yanguas;69
Castilla León;Soria;Santa María de Huerta;387
Castilla León;Soria;Santa María de las Hoyas;166
Castilla León;Soria;Serón de Nágima;209
Castilla León;Soria;Soliedra;38
Castilla León;Soria;Soria;39528
Castilla León;Soria;Sotillo del Rincón;206
Castilla León;Soria;Suellacabras;33
Castilla León;Soria;Tajahuerce;32
Castilla León;Soria;Tajueco;91
Castilla León;Soria;Talveila;159
Castilla León;Soria;Tardelcuende;525
Castilla León;Soria;Taroda;63
Castilla León;Soria;Tejado;159
Castilla León;Soria;Torlengua;90
Castilla León;Soria;Torreblacos;29
Castilla León;Soria;Torrubia de Soria;79
Castilla León;Soria;Trévago;71
Castilla León;Soria;Ucero;87
Castilla León;Soria;Vadillo;140
Castilla León;Soria;Valdeavellano de Tera;236
Castilla León;Soria;Valdegeña;47
Castilla León;Soria;Valdelagua del Cerro;16
Castilla León;Soria;Valdemaluque;226
Castilla León;Soria;Valdenebro;125
Castilla León;Soria;Valdeprado;13
Castilla León;Soria;Valderrodilla;99
Castilla León;Soria;Valtajeros;24
Castilla León;Soria;Velamazán;109
Castilla León;Soria;Velilla de la Sierra;33
Castilla León;Soria;Velilla de los Ajos;36
Castilla León;Soria;Viana de Duero;65
Castilla León;Soria;Villaciervos;107
Castilla León;Soria;Villanueva de Gormaz;11
Castilla León;Soria;Villar del Ala;58
Castilla León;Soria;Villar del Campo;27
Castilla León;Soria;Villar del Río;201
Castilla León;Soria;Villares de Soria (Los);95
Castilla León;Soria;Villasayas;82
Castilla León;Soria;Villaseca de Arciel;39
Castilla León;Soria;Vinuesa;1003
Castilla León;Soria;Vizmanos;29
Castilla León;Soria;Vozmediano;44
Castilla León;Soria;Yanguas;114
Castilla León;Soria;Yelo;52
Castilla León;Valladolid;Adalia;61
Castilla León;Valladolid;Aguasal;32
Castilla León;Valladolid;Aguilar de Campos;296
Castilla León;Valladolid;Alaejos;1611
Castilla León;Valladolid;Alcazarén;733
Castilla León;Valladolid;Aldea de San Miguel;229
Castilla León;Valladolid;Aldeamayor de San Martín;3311
Castilla León;Valladolid;Almenara de Adaja;31
Castilla León;Valladolid;Amusquillo;126
Castilla León;Valladolid;Arroyo de la Encomienda;11716
Castilla León;Valladolid;Ataquines;732
Castilla León;Valladolid;Bahabón;174
Castilla León;Valladolid;Barcial de la Loma;136
Castilla León;Valladolid;Barruelo del Valle;64
Castilla León;Valladolid;Becilla de Valderaduey;345
Castilla León;Valladolid;Benafarces;96
Castilla León;Valladolid;Bercero;226
Castilla León;Valladolid;Berceruelo;46
Castilla León;Valladolid;Berrueces;117
Castilla León;Valladolid;Bobadilla del Campo;335
Castilla León;Valladolid;Bocigas;101
Castilla León;Valladolid;Bocos de Duero;66
Castilla León;Valladolid;Boecillo;3538
Castilla León;Valladolid;Bolaños de Campos;362
Castilla León;Valladolid;Brahojos de Medina;152
Castilla León;Valladolid;Bustillo de Chaves;95
Castilla León;Valladolid;Cabezón de Pisuerga;3355
Castilla León;Valladolid;Cabezón de Valderaduey;45
Castilla León;Valladolid;Cabreros del Monte;79
Castilla León;Valladolid;Campaspero;1379
Castilla León;Valladolid;Campillo (El);241
Castilla León;Valladolid;Camporredondo;172
Castilla León;Valladolid;Canalejas de Peñafiel;296
Castilla León;Valladolid;Canillas de Esgueva;97
Castilla León;Valladolid;Carpio;1100
Castilla León;Valladolid;Casasola de Arión;323
Castilla León;Valladolid;Castrejón de Trabancos;222
Castilla León;Valladolid;Castrillo-Tejeriego;212
Castilla León;Valladolid;Castrillo de Duero;145
Castilla León;Valladolid;Castrobol;79
Castilla León;Valladolid;Castrodeza;184
Castilla León;Valladolid;Castromembibre;74
Castilla León;Valladolid;Castromonte;390
Castilla León;Valladolid;Castronuevo de Esgueva;388
Castilla León;Valladolid;Castronuño;996
Castilla León;Valladolid;Castroponce;162
Castilla León;Valladolid;Castroverde de Cerrato;262
Castilla León;Valladolid;Ceinos de Campos;256
Castilla León;Valladolid;Cervillego de la Cruz;106
Castilla León;Valladolid;Cigales;4376
Castilla León;Valladolid;Ciguñuela;380
Castilla León;Valladolid;Cistérniga;7873
Castilla León;Valladolid;Cogeces de Íscar;167
Castilla León;Valladolid;Cogeces del Monte;807
Castilla León;Valladolid;Corcos;242
Castilla León;Valladolid;Corrales de Duero;108
Castilla León;Valladolid;Cubillas de Santa Marta;304
Castilla León;Valladolid;Cuenca de Campos;225
Castilla León;Valladolid;Curiel de Duero;134
Castilla León;Valladolid;Encinas de Esgueva;296
Castilla León;Valladolid;Esguevillas de Esgueva;305
Castilla León;Valladolid;Fombellida;210
Castilla León;Valladolid;Fompedraza;134
Castilla León;Valladolid;Fontihoyuelo;33
Castilla León;Valladolid;Fresno el Viejo;1076
Castilla León;Valladolid;Fuensaldaña;1393
Castilla León;Valladolid;Fuente-Olmedo;46
Castilla León;Valladolid;Fuente el Sol;230
Castilla León;Valladolid;Gallegos de Hornija;146
Castilla León;Valladolid;Gatón de Campos;39
Castilla León;Valladolid;Geria;485
Castilla León;Valladolid;Herrín de Campos;167
Castilla León;Valladolid;Hornillos de Eresma;178
Castilla León;Valladolid;Íscar;6902
Castilla León;Valladolid;Laguna de Duero;21762
Castilla León;Valladolid;Langayo;337
Castilla León;Valladolid;Llano de Olmedo;72
Castilla León;Valladolid;Lomoviejo;216
Castilla León;Valladolid;Manzanillo;61
Castilla León;Valladolid;Marzales;55
Castilla León;Valladolid;Matapozuelos;1061
Castilla León;Valladolid;Matilla de los Caños;101
Castilla León;Valladolid;Mayorga;1931
Castilla León;Valladolid;Medina de Rioseco;4977
Castilla León;Valladolid;Medina del Campo;21540
Castilla León;Valladolid;Megeces;474
Castilla León;Valladolid;Melgar de Abajo;142
Castilla León;Valladolid;Melgar de Arriba;224
Castilla León;Valladolid;Mojados;3351
Castilla León;Valladolid;Monasterio de Vega;88
Castilla León;Valladolid;Montealegre de Campos;150
Castilla León;Valladolid;Montemayor de Pililla;1003
Castilla León;Valladolid;Moral de la Reina;202
Castilla León;Valladolid;Moraleja de las Panaderas;42
Castilla León;Valladolid;Morales de Campos;165
Castilla León;Valladolid;Mota del Marqués;410
Castilla León;Valladolid;Mucientes;732
Castilla León;Valladolid;Mudarra (La);197
Castilla León;Valladolid;Muriel;183
Castilla León;Valladolid;Nava del Rey;2144
Castilla León;Valladolid;Nueva Villa de las Torres;347
Castilla León;Valladolid;Olivares de Duero;342
Castilla León;Valladolid;Olmedo;3845
Castilla León;Valladolid;Olmos de Esgueva;236
Castilla León;Valladolid;Olmos de Peñafiel;74
Castilla León;Valladolid;Palazuelo de Vedija;228
Castilla León;Valladolid;Parrilla (La);571
Castilla León;Valladolid;Pedraja de Portillo (La);1167
Castilla León;Valladolid;Pedrajas de San Esteban;3649
Castilla León;Valladolid;Pedrosa del Rey;205
Castilla León;Valladolid;Peñafiel;5592
Castilla León;Valladolid;Peñaflor de Hornija;361
Castilla León;Valladolid;Pesquera de Duero;534
Castilla León;Valladolid;Piña de Esgueva;352
Castilla León;Valladolid;Piñel de Abajo;192
Castilla León;Valladolid;Piñel de Arriba;137
Castilla León;Valladolid;Pollos;714
Castilla León;Valladolid;Portillo;2583
Castilla León;Valladolid;Pozal de Gallinas;526
Castilla León;Valladolid;Pozaldez;556
Castilla León;Valladolid;Pozuelo de la Orden;62
Castilla León;Valladolid;Puras;57
Castilla León;Valladolid;Quintanilla de Arriba;201
Castilla León;Valladolid;Quintanilla de Onésimo;1163
Castilla León;Valladolid;Quintanilla de Trigueros;110
Castilla León;Valladolid;Quintanilla del Molar;71
Castilla León;Valladolid;Rábano;215
Castilla León;Valladolid;Ramiro;49
Castilla León;Valladolid;Renedo de Esgueva;2808
Castilla León;Valladolid;Roales de Campos;221
Castilla León;Valladolid;Robladillo;104
Castilla León;Valladolid;Roturas;37
Castilla León;Valladolid;Rubí de Bracamonte;291
Castilla León;Valladolid;Rueda;1413
Castilla León;Valladolid;Saelices de Mayorga;143
Castilla León;Valladolid;Salvador de Zapardiel;167
Castilla León;Valladolid;San Cebrián de Mazote;178
Castilla León;Valladolid;San Llorente;171
Castilla León;Valladolid;San Martín de Valvení;99
Castilla León;Valladolid;San Miguel del Arroyo;767
Castilla León;Valladolid;San Miguel del Pino;280
Castilla León;Valladolid;San Pablo de la Moraleja;147
Castilla León;Valladolid;San Pedro de Latarce;571
Castilla León;Valladolid;San Pelayo;46
Castilla León;Valladolid;San Román de Hornija;384
Castilla León;Valladolid;San Salvador;36
Castilla León;Valladolid;San Vicente del Palacio;220
Castilla León;Valladolid;Santa Eufemia del Arroyo;111
Castilla León;Valladolid;Santervás de Campos;137
Castilla León;Valladolid;Santibáñez de Valcorba;179
Castilla León;Valladolid;Santovenia de Pisuerga;3732
Castilla León;Valladolid;Sardón de Duero;700
Castilla León;Valladolid;Seca (La);1097
Castilla León;Valladolid;Serrada;1165
Castilla León;Valladolid;Siete Iglesias de Trabancos;562
Castilla León;Valladolid;Simancas;5152
Castilla León;Valladolid;Tamariz de Campos;97
Castilla León;Valladolid;Tiedra;350
Castilla León;Valladolid;Tordehumos;475
Castilla León;Valladolid;Tordesillas;9067
Castilla León;Valladolid;Torre de Esgueva;81
Castilla León;Valladolid;Torre de Peñafiel;46
Castilla León;Valladolid;Torrecilla de la Abadesa;331
Castilla León;Valladolid;Torrecilla de la Orden;298
Castilla León;Valladolid;Torrecilla de la Torre;36
Castilla León;Valladolid;Torrelobatón;506
Castilla León;Valladolid;Torrescárcela;159
Castilla León;Valladolid;Traspinedo;1028
Castilla León;Valladolid;Trigueros del Valle;351
Castilla León;Valladolid;Tudela de Duero;8503
Castilla León;Valladolid;Unión de Campos (La);279
Castilla León;Valladolid;Urones de Castroponce;128
Castilla León;Valladolid;Urueña;225
Castilla León;Valladolid;Valbuena de Duero;502
Castilla León;Valladolid;Valdearcos de la Vega;127
Castilla León;Valladolid;Valdenebro de los Valles;211
Castilla León;Valladolid;Valdestillas;1804
Castilla León;Valladolid;Valdunquillo;176
Castilla León;Valladolid;Valladolid;317864
Castilla León;Valladolid;Valoria la Buena;698
Castilla León;Valladolid;Valverde de Campos;122
Castilla León;Valladolid;Vega de Ruiponce;117
Castilla León;Valladolid;Vega de Valdetronco;144
Castilla León;Valladolid;Velascálvaro;197
Castilla León;Valladolid;Velilla;127
Castilla León;Valladolid;Velliza;130
Castilla León;Valladolid;Ventosa de la Cuesta;151
Castilla León;Valladolid;Viana de Cega;1943
Castilla León;Valladolid;Villabáñez;535
Castilla León;Valladolid;Villabaruz de Campos;40
Castilla León;Valladolid;Villabrágima;1114
Castilla León;Valladolid;Villacarralón;99
Castilla León;Valladolid;Villacid de Campos;93
Castilla León;Valladolid;Villaco;108
Castilla León;Valladolid;Villafrades de Campos;85
Castilla León;Valladolid;Villafranca de Duero;375
Castilla León;Valladolid;Villafrechós;519
Castilla León;Valladolid;Villafuerte;126
Castilla León;Valladolid;Villagarcía de Campos;384
Castilla León;Valladolid;Villagómez la Nueva;74
Castilla León;Valladolid;Villalán de Campos;51
Castilla León;Valladolid;Villalar de los Comuneros;466
Castilla León;Valladolid;Villalba de la Loma;54
Castilla León;Valladolid;Villalba de los Alcores;488
Castilla León;Valladolid;Villalbarba;138
Castilla León;Valladolid;Villalón de Campos;1915
Castilla León;Valladolid;Villamuriel de Campos;81
Castilla León;Valladolid;Villán de Tordesillas;144
Castilla León;Valladolid;Villanubla;2067
Castilla León;Valladolid;Villanueva de Duero;1193
Castilla León;Valladolid;Villanueva de la Condesa;76
Castilla León;Valladolid;Villanueva de los Caballeros;238
Castilla León;Valladolid;Villanueva de los Infantes;122
Castilla León;Valladolid;Villanueva de San Mancio;121
Castilla León;Valladolid;Villardefrades;197
Castilla León;Valladolid;Villarmentero de Esgueva;106
Castilla León;Valladolid;Villasexmir;93
Castilla León;Valladolid;Villavaquerín;209
Castilla León;Valladolid;Villavellid;73
Castilla León;Valladolid;Villaverde de Medina;553
Castilla León;Valladolid;Villavicencio de los Caballeros;260
Castilla León;Valladolid;Viloria;387
Castilla León;Valladolid;Wamba;363
Castilla León;Valladolid;Zaratán;4992
Castilla León;Valladolid;Zarza (La);136
Castilla León;Zamora;Abezames;88
Castilla León;Zamora;Alcañices;1122
Castilla León;Zamora;Alcubilla de Nogales;146
Castilla León;Zamora;Alfaraz de Sayago;173
Castilla León;Zamora;Algodre;181
Castilla León;Zamora;Almaraz de Duero;424
Castilla León;Zamora;Almeida de Sayago;577
Castilla León;Zamora;Andavías;478
Castilla León;Zamora;Arcenillas;356
Castilla León;Zamora;Arcos de la Polvorosa;265
Castilla León;Zamora;Argañín;78
Castilla León;Zamora;Argujillo;337
Castilla León;Zamora;Arquillinos;141
Castilla León;Zamora;Arrabalde;294
Castilla León;Zamora;Aspariegos;297
Castilla León;Zamora;Asturianos;267
Castilla León;Zamora;Ayoó de Vidriales;397
Castilla León;Zamora;Barcial del Barco;280
Castilla León;Zamora;Belver de los Montes;382
Castilla León;Zamora;Benavente;19119
Castilla León;Zamora;Benegiles;393
Castilla León;Zamora;Bermillo de Sayago;1259
Castilla León;Zamora;Bóveda de Toro (La);875
Castilla León;Zamora;Bretó;212
Castilla León;Zamora;Bretocino;259
Castilla León;Zamora;Brime de Sog;187
Castilla León;Zamora;Brime de Urz;142
Castilla León;Zamora;Burganes de Valverde;810
Castilla León;Zamora;Bustillo del Oro;106
Castilla León;Zamora;Cabañas de Sayago;187
Castilla León;Zamora;Calzadilla de Tera;416
Castilla León;Zamora;Camarzana de Tera;982
Castilla León;Zamora;Cañizal;541
Castilla León;Zamora;Cañizo;274
Castilla León;Zamora;Carbajales de Alba;679
Castilla León;Zamora;Carbellino;222
Castilla León;Zamora;Casaseca de Campeán;121
Castilla León;Zamora;Casaseca de las Chanas;420
Castilla León;Zamora;Castrillo de la Guareña;135
Castilla León;Zamora;Castrogonzalo;519
Castilla León;Zamora;Castronuevo;312
Castilla León;Zamora;Castroverde de Campos;364
Castilla León;Zamora;Cazurra;81
Castilla León;Zamora;Cerecinos de Campos;368
Castilla León;Zamora;Cerecinos del Carrizal;143
Castilla León;Zamora;Cernadilla;160
Castilla León;Zamora;Cobreros;613
Castilla León;Zamora;Coomonte;253
Castilla León;Zamora;Coreses;1156
Castilla León;Zamora;Corrales;1078
Castilla León;Zamora;Cotanes del Monte;129
Castilla León;Zamora;Cubillos;363
Castilla León;Zamora;Cubo de Benavente;140
Castilla León;Zamora;Cubo de Tierra del Vino (El);429
Castilla León;Zamora;Cuelgamures;124
Castilla León;Zamora;Entrala;162
Castilla León;Zamora;Espadañedo;158
Castilla León;Zamora;Faramontanos de Tábara;435
Castilla León;Zamora;Fariza;646
Castilla León;Zamora;Fermoselle;1488
Castilla León;Zamora;Ferreras de Abajo;601
Castilla León;Zamora;Ferreras de Arriba;479
Castilla León;Zamora;Ferreruela;552
Castilla León;Zamora;Figueruela de Arriba;423
Castilla León;Zamora;Fonfría;965
Castilla León;Zamora;Fresno de la Polvorosa;176
Castilla León;Zamora;Fresno de la Ribera;397
Castilla León;Zamora;Fresno de Sayago;242
Castilla León;Zamora;Friera de Valverde;227
Castilla León;Zamora;Fuente Encalada;125
Castilla León;Zamora;Fuentelapeña;858
Castilla León;Zamora;Fuentes de Ropel;513
Castilla León;Zamora;Fuentesaúco;1940
Castilla León;Zamora;Fuentesecas;74
Castilla León;Zamora;Fuentespreadas;330
Castilla León;Zamora;Galende;1313
Castilla León;Zamora;Gallegos del Pan;139
Castilla León;Zamora;Gallegos del Río;663
Castilla León;Zamora;Gamones;95
Castilla León;Zamora;Gema;257
Castilla León;Zamora;Granja de Moreruela;302
Castilla León;Zamora;Granucillo;191
Castilla León;Zamora;Guarrate;354
Castilla León;Zamora;Hermisende;324
Castilla León;Zamora;Hiniesta (La);335
Castilla León;Zamora;Jambrina;215
Castilla León;Zamora;Justel;120
Castilla León;Zamora;Losacino;271
Castilla León;Zamora;Losacio;97
Castilla León;Zamora;Lubián;377
Castilla León;Zamora;Luelmo;220
Castilla León;Zamora;Maderal (El);242
Castilla León;Zamora;Madridanos;529
Castilla León;Zamora;Mahide;422
Castilla León;Zamora;Maire de Castroponce;184
Castilla León;Zamora;Malva;194
Castilla León;Zamora;Manganeses de la Lampreana;599
Castilla León;Zamora;Manganeses de la Polvorosa;758
Castilla León;Zamora;Manzanal de Arriba;422
Castilla León;Zamora;Manzanal de los Infantes;147
Castilla León;Zamora;Manzanal del Barco;161
Castilla León;Zamora;Matilla de Arzón;211
Castilla León;Zamora;Matilla la Seca;63
Castilla León;Zamora;Mayalde;225
Castilla León;Zamora;Melgar de Tera;457
Castilla León;Zamora;Micereces de Tera;551
Castilla León;Zamora;Milles de la Polvorosa;252
Castilla León;Zamora;Molacillos;278
Castilla León;Zamora;Molezuelas de la Carballeda;87
Castilla León;Zamora;Mombuey;444
Castilla León;Zamora;Monfarracinos;872
Castilla León;Zamora;Montamarta;620
Castilla León;Zamora;Moral de Sayago;323
Castilla León;Zamora;Moraleja de Sayago;276
Castilla León;Zamora;Moraleja del Vino;1525
Castilla León;Zamora;Morales de Rey;684
Castilla León;Zamora;Morales de Toro;1143
Castilla León;Zamora;Morales de Valverde;247
Castilla León;Zamora;Morales del Vino;2634
Castilla León;Zamora;Moralina;333
Castilla León;Zamora;Moreruela de los Infanzones;399
Castilla León;Zamora;Moreruela de Tábara;410
Castilla León;Zamora;Muelas de los Caballeros;221
Castilla León;Zamora;Muelas del Pan;796
Castilla León;Zamora;Muga de Sayago;406
Castilla León;Zamora;Navianos de Valverde;221
Castilla León;Zamora;Olmillos de Castro;315
Castilla León;Zamora;Otero de Bodas;208
Castilla León;Zamora;Pajares de la Lampreana;459
Castilla León;Zamora;Palacios de Sanabria;293
Castilla León;Zamora;Palacios del Pan;242
Castilla León;Zamora;Pedralba de la Pradería;303
Castilla León;Zamora;Pego (El);364
Castilla León;Zamora;Peleagonzalo;349
Castilla León;Zamora;Peleas de Abajo;288
Castilla León;Zamora;Peñausende;502
Castilla León;Zamora;Peque;174
Castilla León;Zamora;Perdigón (El);753
Castilla León;Zamora;Pereruela;659
Castilla León;Zamora;Perilla de Castro;206
Castilla León;Zamora;Pías;158
Castilla León;Zamora;Piedrahita de Castro;124
Castilla León;Zamora;Piñero (El);267
Castilla León;Zamora;Pinilla de Toro;295
Castilla León;Zamora;Pino del Oro;200
Castilla León;Zamora;Pobladura de Valderaduey;59
Castilla León;Zamora;Pobladura del Valle;326
Castilla León;Zamora;Porto;235
Castilla León;Zamora;Pozoantiguo;290
Castilla León;Zamora;Pozuelo de Tábara;170
Castilla León;Zamora;Prado;85
Castilla León;Zamora;Puebla de Sanabria;1571
Castilla León;Zamora;Pueblica de Valverde;254
Castilla León;Zamora;Quintanilla de Urz;134
Castilla León;Zamora;Quintanilla del Monte;108
Castilla León;Zamora;Quintanilla del Olmo;41
Castilla León;Zamora;Quiruelas de Vidriales;820
Castilla León;Zamora;Rabanales;680
Castilla León;Zamora;Rábano de Aliste;436
Castilla León;Zamora;Requejo;165
Castilla León;Zamora;Revellinos;308
Castilla León;Zamora;Riofrío de Aliste;894
Castilla León;Zamora;Rionegro del Puente;318
Castilla León;Zamora;Roales;637
Castilla León;Zamora;Robleda-Cervantes;465
Castilla León;Zamora;Roelos de Sayago;180
Castilla León;Zamora;Rosinos de la Requejada;429
Castilla León;Zamora;Salce;116
Castilla León;Zamora;Samir de los Caños;207
Castilla León;Zamora;San Agustín del Pozo;205
Castilla León;Zamora;San Cebrián de Castro;301
Castilla León;Zamora;San Cristóbal de Entreviñas;1582
Castilla León;Zamora;San Esteban del Molar;151
Castilla León;Zamora;San Justo;298
Castilla León;Zamora;San Martín de Valderaduey;84
Castilla León;Zamora;San Miguel de la Ribera;356
Castilla León;Zamora;San Miguel del Valle;192
Castilla León;Zamora;San Pedro de Ceque;593
Castilla León;Zamora;San Pedro de la Nave-Almendra;420
Castilla León;Zamora;San Vicente de la Cabeza;481
Castilla León;Zamora;San Vitero;669
Castilla León;Zamora;Santa Clara de Avedillo;210
Castilla León;Zamora;Santa Colomba de las Monjas;294
Castilla León;Zamora;Santa Cristina de la Polvorosa;1205
Castilla León;Zamora;Santa Croya de Tera;388
Castilla León;Zamora;Santa Eufemia del Barco;247
Castilla León;Zamora;Santa María de la Vega;410
Castilla León;Zamora;Santa María de Valverde;90
Castilla León;Zamora;Santibáñez de Tera;493
Castilla León;Zamora;Santibáñez de Vidriales;1198
Castilla León;Zamora;Santovenia;326
Castilla León;Zamora;Sanzoles;617
Castilla León;Zamora;Tábara;903
Castilla León;Zamora;Tapioles;196
Castilla León;Zamora;Toro;9822
Castilla León;Zamora;Torre del Valle (La);176
Castilla León;Zamora;Torregamones;304
Castilla León;Zamora;Torres del Carrizal;456
Castilla León;Zamora;Trabazos;1000
Castilla León;Zamora;Trefacio;202
Castilla León;Zamora;Uña de Quintana;177
Castilla León;Zamora;Vadillo de la Guareña;324
Castilla León;Zamora;Valcabado;322
Castilla León;Zamora;Valdefinjas;80
Castilla León;Zamora;Valdescorriel;179
Castilla León;Zamora;Vallesa de la Guareña;136
Castilla León;Zamora;Vega de Tera;419
Castilla León;Zamora;Vega de Villalobos;127
Castilla León;Zamora;Vegalatrave;128
Castilla León;Zamora;Venialbo;475
Castilla León;Zamora;Vezdemarbán;583
Castilla León;Zamora;Vidayanes;92
Castilla León;Zamora;Videmala;169
Castilla León;Zamora;Villabrázaro;309
Castilla León;Zamora;Villabuena del Puente;821
Castilla León;Zamora;Villadepera;271
Castilla León;Zamora;Villaescusa;321
Castilla León;Zamora;Villafáfila;582
Castilla León;Zamora;Villaferrueña;132
Castilla León;Zamora;Villageriz;55
Castilla León;Zamora;Villalazán;343
Castilla León;Zamora;Villalba de la Lampreana;264
Castilla León;Zamora;Villalcampo;546
Castilla León;Zamora;Villalobos;317
Castilla León;Zamora;Villalonso;99
Castilla León;Zamora;Villalpando;1663
Castilla León;Zamora;Villalube;209
Castilla León;Zamora;Villamayor de Campos;447
Castilla León;Zamora;Villamor de los Escuderos;494
Castilla León;Zamora;Villanázar;335
Castilla León;Zamora;Villanueva de Azoague;329
Castilla León;Zamora;Villanueva de Campeán;147
Castilla León;Zamora;Villanueva de las Peras;131
Castilla León;Zamora;Villanueva del Campo;996
Castilla León;Zamora;Villar de Fallaves;80
Castilla León;Zamora;Villar del Buey;737
Castilla León;Zamora;Villaralbo;1874
Castilla León;Zamora;Villardeciervos;474
Castilla León;Zamora;Villardiegua de la Ribera;158
Castilla León;Zamora;Villárdiga;96
Castilla León;Zamora;Villardondiego;112
Castilla León;Zamora;Villarrín de Campos;550
Castilla León;Zamora;Villaseco del Pan;269
Castilla León;Zamora;Villavendimio;207
Castilla León;Zamora;Villaveza de Valverde;105
Castilla León;Zamora;Villaveza del Agua;249
Castilla León;Zamora;Viñas;229
Castilla León;Zamora;Zamora;66293
Catalunya;Barcelona;Abrera;11521
Catalunya;Barcelona;Aguilar de Segarra;257
Catalunya;Barcelona;Aiguafreda;2464
Catalunya;Barcelona;Alella;9397
Catalunya;Barcelona;Alpens;311
Catalunya;Barcelona;Ametlla del Vallès (L');7949
Catalunya;Barcelona;Arenys de Mar;14627
Catalunya;Barcelona;Arenys de Munt;8190
Catalunya;Barcelona;Argençola;240
Catalunya;Barcelona;Argentona;11633
Catalunya;Barcelona;Artés;5433
Catalunya;Barcelona;Avià;2206
Catalunya;Barcelona;Avinyó;2289
Catalunya;Barcelona;Avinyonet del Penedès;1690
Catalunya;Barcelona;Badalona;219547
Catalunya;Barcelona;Badia del Vallès;13679
Catalunya;Barcelona;Bagà;2362
Catalunya;Barcelona;Balenyà;3743
Catalunya;Barcelona;Balsareny;3512
Catalunya;Barcelona;Barberà del Vallès;31144
Catalunya;Barcelona;Barcelona;1621537
Catalunya;Barcelona;Begues;6271
Catalunya;Barcelona;Bellprat;92
Catalunya;Barcelona;Berga;17160
Catalunya;Barcelona;Bigues i Riells;8401
Catalunya;Barcelona;Borredà;614
Catalunya;Barcelona;Bruc (El);1904
Catalunya;Barcelona;Brull (El);252
Catalunya;Barcelona;Cabanyes (Les);888
Catalunya;Barcelona;Cabrera d'Anoia;1320
Catalunya;Barcelona;Cabrera de Mar;4408
Catalunya;Barcelona;Cabrils;6964
Catalunya;Barcelona;Calaf;3630
Catalunya;Barcelona;Calders;899
Catalunya;Barcelona;Caldes d'Estrac;2799
Catalunya;Barcelona;Caldes de Montbui;16885
Catalunya;Barcelona;Calella;18627
Catalunya;Barcelona;Calldetenes;2391
Catalunya;Barcelona;Callús;1759
Catalunya;Barcelona;Calonge de Segarra;196
Catalunya;Barcelona;Campins;390
Catalunya;Barcelona;Canet de Mar;13548
Catalunya;Barcelona;Canovelles;16023
Catalunya;Barcelona;Cànoves i Samalús;2742
Catalunya;Barcelona;Canyelles;4104
Catalunya;Barcelona;Capellades;5525
Catalunya;Barcelona;Capolat;77
Catalunya;Barcelona;Cardedeu;16596
Catalunya;Barcelona;Cardona;5187
Catalunya;Barcelona;Carme;832
Catalunya;Barcelona;Casserres;1590
Catalunya;Barcelona;Castell de l'Areny;75
Catalunya;Barcelona;Castellar de n'Hug;198
Catalunya;Barcelona;Castellar del Riu;154
Catalunya;Barcelona;Castellar del Vallès;23002
Catalunya;Barcelona;Castellbell i el Vilar;3680
Catalunya;Barcelona;Castellbisbal;11977
Catalunya;Barcelona;Castellcir;628
Catalunya;Barcelona;Castelldefels;62080
Catalunya;Barcelona;Castellet i la Gornal;2222
Catalunya;Barcelona;Castellfollit de Riubregós;195
Catalunya;Barcelona;Castellfollit del Boix;426
Catalunya;Barcelona;Castellgalí;1918
Catalunya;Barcelona;Castellnou de Bages;1021
Catalunya;Barcelona;Castellolí;506
Catalunya;Barcelona;Castellterçol;2375
Catalunya;Barcelona;Castellví de la Marca;1661
Catalunya;Barcelona;Castellví de Rosanes;1719
Catalunya;Barcelona;Centelles;7209
Catalunya;Barcelona;Cercs;1334
Catalunya;Barcelona;Cerdanyola del Vallès;58747
Catalunya;Barcelona;Cervelló;8393
Catalunya;Barcelona;Collbató;4040
Catalunya;Barcelona;Collsuspina;351
Catalunya;Barcelona;Copons;318
Catalunya;Barcelona;Corbera de Llobregat;13843
Catalunya;Barcelona;Cornellà de Llobregat;86519
Catalunya;Barcelona;Cubelles;13711
Catalunya;Barcelona;Dosrius;4937
Catalunya;Barcelona;Esparreguera;21855
Catalunya;Barcelona;Esplugues de Llobregat;46862
Catalunya;Barcelona;Espunyola (L');260
Catalunya;Barcelona;Estany (L');390
Catalunya;Barcelona;Figaró-Montmany;1057
Catalunya;Barcelona;Fígols;48
Catalunya;Barcelona;Fogars de la Selva;1513
Catalunya;Barcelona;Fogars de Montclús;465
Catalunya;Barcelona;Folgueroles;2205
Catalunya;Barcelona;Fonollosa;1399
Catalunya;Barcelona;Font-rubí;1483
Catalunya;Barcelona;Franqueses del Vallès (Les);17660
Catalunya;Barcelona;Gaià;171
Catalunya;Barcelona;Gallifa;214
Catalunya;Barcelona;Garriga (La);14991
Catalunya;Barcelona;Gavà;45994
Catalunya;Barcelona;Gelida;6801
Catalunya;Barcelona;Gironella;5052
Catalunya;Barcelona;Gisclareny;34
Catalunya;Barcelona;Granada (La);1976
Catalunya;Barcelona;Granera;77
Catalunya;Barcelona;Granollers;60658
Catalunya;Barcelona;Gualba;1192
Catalunya;Barcelona;Guardiola de Berguedà;1007
Catalunya;Barcelona;Gurb;2475
Catalunya;Barcelona;Hospitalet de Llobregat (L');257038
Catalunya;Barcelona;Hostalets de Pierola (Els);2612
Catalunya;Barcelona;Igualada;38918
Catalunya;Barcelona;Jorba;827
Catalunya;Barcelona;Llacuna (La);925
Catalunya;Barcelona;Llagosta (La);13820
Catalunya;Barcelona;Lliçà d'Amunt;14143
Catalunya;Barcelona;Lliçà de Vall;6290
Catalunya;Barcelona;Llinars del Vallès;9035
Catalunya;Barcelona;Lluçà;260
Catalunya;Barcelona;Malgrat de Mar;18472
Catalunya;Barcelona;Malla;255
Catalunya;Barcelona;Manlleu;20647
Catalunya;Barcelona;Manresa;76558
Catalunya;Barcelona;Marganell;308
Catalunya;Barcelona;Martorell;26681
Catalunya;Barcelona;Martorelles;4922
Catalunya;Barcelona;Masies de Roda (Les);755
Catalunya;Barcelona;Masies de Voltregà (Les);3232
Catalunya;Barcelona;Masnou (El);22288
Catalunya;Barcelona;Masquefa;8168
Catalunya;Barcelona;Matadepera;8616
Catalunya;Barcelona;Mataró;121722
Catalunya;Barcelona;Mediona;2360
Catalunya;Barcelona;Moià;5710
Catalunya;Barcelona;Molins de Rei;24067
Catalunya;Barcelona;Mollet del Vallès;52484
Catalunya;Barcelona;Monistrol de Calders;683
Catalunya;Barcelona;Monistrol de Montserrat;3029
Catalunya;Barcelona;Montcada i Reixac;33453
Catalunya;Barcelona;Montclar;112
Catalunya;Barcelona;Montesquiu;906
Catalunya;Barcelona;Montgat;10270
Catalunya;Barcelona;Montmajor;487
Catalunya;Barcelona;Montmaneu;192
Catalunya;Barcelona;Montmeló;8955
Catalunya;Barcelona;Montornès del Vallès;15509
Catalunya;Barcelona;Montseny;319
Catalunya;Barcelona;Muntanyola;570
Catalunya;Barcelona;Mura;238
Catalunya;Barcelona;Navarcles;5947
Catalunya;Barcelona;Navàs;6243
Catalunya;Barcelona;Nou de Berguedà (La);159
Catalunya;Barcelona;Òdena;3334
Catalunya;Barcelona;Olèrdola;3462
Catalunya;Barcelona;Olesa de Bonesvalls;1740
Catalunya;Barcelona;Olesa de Montserrat;23301
Catalunya;Barcelona;Olivella;3340
Catalunya;Barcelona;Olost;1217
Catalunya;Barcelona;Olvan;903
Catalunya;Barcelona;Orís;284
Catalunya;Barcelona;Oristà;585
Catalunya;Barcelona;Orpí;187
Catalunya;Barcelona;Òrrius;640
Catalunya;Barcelona;Pacs del Penedès;869
Catalunya;Barcelona;Palafolls;8584
Catalunya;Barcelona;Palau-solità i Plegamans;14070
Catalunya;Barcelona;Pallejà;11134
Catalunya;Barcelona;Palma de Cervelló (La);3057
Catalunya;Barcelona;Papiol (El);3900
Catalunya;Barcelona;Parets del Vallès;17632
Catalunya;Barcelona;Perafita;408
Catalunya;Barcelona;Piera;14324
Catalunya;Barcelona;Pineda de Mar;26203
Catalunya;Barcelona;Pla del Penedès (El);1041
Catalunya;Barcelona;Pobla de Claramunt (La);2286
Catalunya;Barcelona;Pobla de Lillet (La);1312
Catalunya;Barcelona;Polinyà;7676
Catalunya;Barcelona;Pont de Vilomara i Rocafort (El);3714
Catalunya;Barcelona;Pontons;530
Catalunya;Barcelona;Prat de Llobregat (El);63418
Catalunya;Barcelona;Prats de Lluçanès;2722
Catalunya;Barcelona;Prats de Rei (Els);538
Catalunya;Barcelona;Premià de Dalt;9944
Catalunya;Barcelona;Premià de Mar;27399
Catalunya;Barcelona;Puig-reig;4403
Catalunya;Barcelona;Puigdàlber;508
Catalunya;Barcelona;Pujalt;203
Catalunya;Barcelona;Quar (La);61
Catalunya;Barcelona;Rajadell;496
Catalunya;Barcelona;Rellinars;713
Catalunya;Barcelona;Ripollet;37088
Catalunya;Barcelona;Roca del Vallès (La);10214
Catalunya;Barcelona;Roda de Ter;6015
Catalunya;Barcelona;Rubí;72987
Catalunya;Barcelona;Rubió;202
Catalunya;Barcelona;Rupit i Pruit;325
Catalunya;Barcelona;Sabadell;206493
Catalunya;Barcelona;Sagàs;134
Catalunya;Barcelona;Saldes;348
Catalunya;Barcelona;Sallent;7129
Catalunya;Barcelona;Sant Adrià de Besòs;33761
Catalunya;Barcelona;Sant Agustí de Lluçanès;101
Catalunya;Barcelona;Sant Andreu de la Barca;26401
Catalunya;Barcelona;Sant Andreu de Llavaneres;10181
Catalunya;Barcelona;Sant Antoni de Vilamajor;5444
Catalunya;Barcelona;Sant Bartomeu del Grau;957
Catalunya;Barcelona;Sant Boi de Llobregat;82428
Catalunya;Barcelona;Sant Boi de Lluçanès;569
Catalunya;Barcelona;Sant Cebrià de Vallalta;3309
Catalunya;Barcelona;Sant Celoni;16860
Catalunya;Barcelona;Sant Climent de Llobregat;3779
Catalunya;Barcelona;Sant Cugat del Vallès;79253
Catalunya;Barcelona;Sant Cugat Sesgarrigues;932
Catalunya;Barcelona;Sant Esteve de Palautordera;2458
Catalunya;Barcelona;Sant Esteve Sesrovires;7202
Catalunya;Barcelona;Sant Feliu de Codines;5702
Catalunya;Barcelona;Sant Feliu de Llobregat;42919
Catalunya;Barcelona;Sant Feliu Sasserra;641
Catalunya;Barcelona;Sant Fost de Campsentelles;8234
Catalunya;Barcelona;Sant Fruitós de Bages;7961
Catalunya;Barcelona;Sant Hipòlit de Voltregà;3447
Catalunya;Barcelona;Sant Iscle de Vallalta;1267
Catalunya;Barcelona;Sant Jaume de Frontanyà;29
Catalunya;Barcelona;Sant Joan de Vilatorrada;10779
Catalunya;Barcelona;Sant Joan Despí;32030
Catalunya;Barcelona;Sant Julià de Cerdanyola;273
Catalunya;Barcelona;Sant Julià de Vilatorta;2955
Catalunya;Barcelona;Sant Just Desvern;15811
Catalunya;Barcelona;Sant Llorenç d'Hortons;2419
Catalunya;Barcelona;Sant Llorenç Savall;2402
Catalunya;Barcelona;Sant Martí d'Albars;113
Catalunya;Barcelona;Sant Martí de Centelles;1001
Catalunya;Barcelona;Sant Martí de Tous;1160
Catalunya;Barcelona;Sant Martí Sarroca;3142
Catalunya;Barcelona;Sant Martí Sesgueioles;371
Catalunya;Barcelona;Sant Mateu de Bages;658
Catalunya;Barcelona;Sant Pere de Ribes;28353
Catalunya;Barcelona;Sant Pere de Riudebitlles;2376
Catalunya;Barcelona;Sant Pere de Torelló;2389
Catalunya;Barcelona;Sant Pere de Vilamajor;4021
Catalunya;Barcelona;Sant Pere Sallavinera;171
Catalunya;Barcelona;Sant Pol de Mar;5102
Catalunya;Barcelona;Sant Quintí de Mediona;2167
Catalunya;Barcelona;Sant Quirze de Besora;2257
Catalunya;Barcelona;Sant Quirze del Vallès;18462
Catalunya;Barcelona;Sant Quirze Safaja;645
Catalunya;Barcelona;Sant Sadurní d'Anoia;12237
Catalunya;Barcelona;Sant Sadurní d'Osormort;101
Catalunya;Barcelona;Sant Salvador de Guardiola;3082
Catalunya;Barcelona;Sant Vicenç de Castellet;8564
Catalunya;Barcelona;Sant Vicenç de Montalt;5627
Catalunya;Barcelona;Sant Vicenç de Torelló;1996
Catalunya;Barcelona;Sant Vicenç dels Horts;27701
Catalunya;Barcelona;Santa Cecília de Voltregà;190
Catalunya;Barcelona;Santa Coloma de Cervelló;7744
Catalunya;Barcelona;Santa Coloma de Gramenet;119717
Catalunya;Barcelona;Santa Eugènia de Berga;2231
Catalunya;Barcelona;Santa Eulàlia de Riuprimer;1052
Catalunya;Barcelona;Santa Eulàlia de Ronçana;6802
Catalunya;Barcelona;Santa Fe del Penedès;389
Catalunya;Barcelona;Santa Margarida de Montbui;9834
Catalunya;Barcelona;Santa Margarida i els Monjos;6989
Catalunya;Barcelona;Santa Maria d'Oló;1086
Catalunya;Barcelona;Santa Maria de Besora;163
Catalunya;Barcelona;Santa Maria de Corcó;2293
Catalunya;Barcelona;Santa Maria de Martorelles;850
Catalunya;Barcelona;Santa Maria de Merlès;163
Catalunya;Barcelona;Santa Maria de Miralles;130
Catalunya;Barcelona;Santa Maria de Palautordera;8823
Catalunya;Barcelona;Santa Perpètua de Mogoda;25048
Catalunya;Barcelona;Santa Susanna;3251
Catalunya;Barcelona;Santpedor;6875
Catalunya;Barcelona;Sentmenat;7870
Catalunya;Barcelona;Seva;3370
Catalunya;Barcelona;Sitges;27668
Catalunya;Barcelona;Sobremunt;98
Catalunya;Barcelona;Sora;180
Catalunya;Barcelona;Subirats;3099
Catalunya;Barcelona;Súria;6438
Catalunya;Barcelona;Tagamanent;308
Catalunya;Barcelona;Talamanca;162
Catalunya;Barcelona;Taradell;5964
Catalunya;Barcelona;Tavèrnoles;302
Catalunya;Barcelona;Tavertet;158
Catalunya;Barcelona;Teià;6087
Catalunya;Barcelona;Terrassa;210941
Catalunya;Barcelona;Tiana;7590
Catalunya;Barcelona;Tona;7955
Catalunya;Barcelona;Tordera;15345
Catalunya;Barcelona;Torelló;13808
Catalunya;Barcelona;Torre de Claramunt (La);3726
Catalunya;Barcelona;Torrelavit;1372
Catalunya;Barcelona;Torrelles de Foix;2463
Catalunya;Barcelona;Torrelles de Llobregat;5430
Catalunya;Barcelona;Ullastrell;1864
Catalunya;Barcelona;Vacarisses;5872
Catalunya;Barcelona;Vallbona d'Anoia;1427
Catalunya;Barcelona;Vallcebre;264
Catalunya;Barcelona;Vallgorguina;2465
Catalunya;Barcelona;Vallirana;14066
Catalunya;Barcelona;Vallromanes;2283
Catalunya;Barcelona;Veciana;172
Catalunya;Barcelona;Vic;39844
Catalunya;Barcelona;Vilada;520
Catalunya;Barcelona;Viladecans;63489
Catalunya;Barcelona;Viladecavalls;7322
Catalunya;Barcelona;Vilafranca del Penedès;38425
Catalunya;Barcelona;Vilalba Sasserra;636
Catalunya;Barcelona;Vilanova de Sau;336
Catalunya;Barcelona;Vilanova del Camí;12649
Catalunya;Barcelona;Vilanova del Vallès;4654
Catalunya;Barcelona;Vilanova i la Geltrú;65890
Catalunya;Barcelona;Vilassar de Dalt;8672
Catalunya;Barcelona;Vilassar de Mar;19482
Catalunya;Barcelona;Vilobí del Penedès;1112
Catalunya;Barcelona;Viver i Serrateix;186
Catalunya;Girona;Agullana;812
Catalunya;Girona;Aiguaviva;714
Catalunya;Girona;Albanyà;152
Catalunya;Girona;Albons;687
Catalunya;Girona;Alp;1735
Catalunya;Girona;Amer;2304
Catalunya;Girona;Anglès;5569
Catalunya;Girona;Arbúcies;6595
Catalunya;Girona;Argelaguer;445
Catalunya;Girona;Armentera (L');855
Catalunya;Girona;Avinyonet de Puigventós;1449
Catalunya;Girona;Banyoles;18327
Catalunya;Girona;Bàscara;946
Catalunya;Girona;Begur;4258
Catalunya;Girona;Bellcaire d'Empordà;664
Catalunya;Girona;Besalú;2361
Catalunya;Girona;Bescanó;4450
Catalunya;Girona;Beuda;163
Catalunya;Girona;Bisbal d'Empordà (La);10385
Catalunya;Girona;Biure;243
Catalunya;Girona;Blanes;40047
Catalunya;Girona;Boadella i les Escaules;241
Catalunya;Girona;Bolvir;378
Catalunya;Girona;Bordils;1732
Catalunya;Girona;Borrassà;665
Catalunya;Girona;Breda;3784
Catalunya;Girona;Brunyola;373
Catalunya;Girona;Cabanelles;236
Catalunya;Girona;Cabanes;932
Catalunya;Girona;Cadaqués;2860
Catalunya;Girona;Caldes de Malavella;6710
Catalunya;Girona;Calonge;10637
Catalunya;Girona;Camós;692
Catalunya;Girona;Campdevànol;3505
Catalunya;Girona;Campelles;125
Catalunya;Girona;Campllong;423
Catalunya;Girona;Camprodon;2542
Catalunya;Girona;Canet d'Adri;605
Catalunya;Girona;Cantallops;319
Catalunya;Girona;Capmany;593
Catalunya;Girona;Cassà de la Selva;9537
Catalunya;Girona;Castell-Platja d'Aro;10376
Catalunya;Girona;Castellfollit de la Roca;1043
Catalunya;Girona;Castelló d'Empúries;12111
Catalunya;Girona;Cellera de Ter (La);2186
Catalunya;Girona;Celrà;4513
Catalunya;Girona;Cervià de Ter;889
Catalunya;Girona;Cistella;238
Catalunya;Girona;Colera;573
Catalunya;Girona;Colomers;195
Catalunya;Girona;Corçà;1280
Catalunya;Girona;Cornellà del Terri;2176
Catalunya;Girona;Crespià;253
Catalunya;Girona;Cruïlles, Monells i Sant Sadurní de l'Heura;1272
Catalunya;Girona;Darnius;536
Catalunya;Girona;Das;227
Catalunya;Girona;Escala (L');10140
Catalunya;Girona;Espinelves;190
Catalunya;Girona;Espolla;404
Catalunya;Girona;Esponellà;462
Catalunya;Girona;Far d'Empordà (El);537
Catalunya;Girona;Figueres;43330
Catalunya;Girona;Flaçà;1072
Catalunya;Girona;Foixà;336
Catalunya;Girona;Fontanals de Cerdanya;451
Catalunya;Girona;Fontanilles;173
Catalunya;Girona;Fontcoberta;1251
Catalunya;Girona;Forallac;1737
Catalunya;Girona;Fornells de la Selva;2295
Catalunya;Girona;Fortià;639
Catalunya;Girona;Garrigàs;395
Catalunya;Girona;Garrigoles;160
Catalunya;Girona;Garriguella;825
Catalunya;Girona;Ger;450
Catalunya;Girona;Girona;96188
Catalunya;Girona;Gombrèn;232
Catalunya;Girona;Gualta;380
Catalunya;Girona;Guils de Cerdanya;479
Catalunya;Girona;Hostalric;3994
Catalunya;Girona;Isòvol;289
Catalunya;Girona;Jafre;419
Catalunya;Girona;Jonquera (La);3174
Catalunya;Girona;Juià;326
Catalunya;Girona;Lladó;682
Catalunya;Girona;Llagostera;7764
Catalunya;Girona;Llambilles;678
Catalunya;Girona;Llanars;584
Catalunya;Girona;Llançà;5209
Catalunya;Girona;Llers;1179
Catalunya;Girona;Llívia;1589
Catalunya;Girona;Lloret de Mar;39363
Catalunya;Girona;Llosses (Les);234
Catalunya;Girona;Maçanet de Cabrenys;729
Catalunya;Girona;Maçanet de la Selva;6871
Catalunya;Girona;Madremanya;238
Catalunya;Girona;Maià de Montcal;410
Catalunya;Girona;Masarac;265
Catalunya;Girona;Massanes;713
Catalunya;Girona;Meranges;93
Catalunya;Girona;Mieres;344
Catalunya;Girona;Mollet de Peralada;174
Catalunya;Girona;Molló;360
Catalunya;Girona;Mont-ras;1847
Catalunya;Girona;Montagut i Oix;971
Catalunya;Girona;Navata;1128
Catalunya;Girona;Ogassa;264
Catalunya;Girona;Olot;33524
Catalunya;Girona;Ordis;372
Catalunya;Girona;Osor;354
Catalunya;Girona;Palafrugell;22365
Catalunya;Girona;Palamós;18161
Catalunya;Girona;Palau-sator;290
Catalunya;Girona;Palau-saverdera;1451
Catalunya;Girona;Palau de Santa Eulàlia;112
Catalunya;Girona;Palol de Revardit;479
Catalunya;Girona;Pals;2799
Catalunya;Girona;Pardines;159
Catalunya;Girona;Parlavà;394
Catalunya;Girona;Pau;578
Catalunya;Girona;Pedret i Marzà;160
Catalunya;Girona;Pera (La);443
Catalunya;Girona;Peralada;1805
Catalunya;Girona;Planes d'Hostoles (Les);1756
Catalunya;Girona;Planoles;279
Catalunya;Girona;Pont de Molins;486
Catalunya;Girona;Pontós;238
Catalunya;Girona;Porqueres;4380
Catalunya;Girona;Port de la Selva (El);1015
Catalunya;Girona;Portbou;1325
Catalunya;Girona;Preses (Les);1731
Catalunya;Girona;Puigcerdà;9022
Catalunya;Girona;Quart;2852
Catalunya;Girona;Queralbs;199
Catalunya;Girona;Rabós;217
Catalunya;Girona;Regencós;326
Catalunya;Girona;Ribes de Freser;1976
Catalunya;Girona;Riells i Viabrea;3779
Catalunya;Girona;Ripoll;11057
Catalunya;Girona;Riudarenes;2070
Catalunya;Girona;Riudaura;443
Catalunya;Girona;Riudellots de la Selva;1984
Catalunya;Girona;Riumors;233
Catalunya;Girona;Roses;20197
Catalunya;Girona;Rupià;243
Catalunya;Girona;Sales de Llierca;141
Catalunya;Girona;Salt;29985
Catalunya;Girona;Sant Andreu Salou;152
Catalunya;Girona;Sant Aniol de Finestres;327
Catalunya;Girona;Sant Climent Sescebes;513
Catalunya;Girona;Sant Feliu de Buixalleu;811
Catalunya;Girona;Sant Feliu de Guíxols;21977
Catalunya;Girona;Sant Feliu de Pallerols;1397
Catalunya;Girona;Sant Ferriol;216
Catalunya;Girona;Sant Gregori;3167
Catalunya;Girona;Sant Hilari Sacalm;5763
Catalunya;Girona;Sant Jaume de Llierca;809
Catalunya;Girona;Sant Joan de les Abadesses;3556
Catalunya;Girona;Sant Joan de Mollet;517
Catalunya;Girona;Sant Joan les Fonts;2787
Catalunya;Girona;Sant Jordi Desvalls;649
Catalunya;Girona;Sant Julià de Ramis;3233
Catalunya;Girona;Sant Julià del Llor i Bonmatí;1276
Catalunya;Girona;Sant Llorenç de la Muga;213
Catalunya;Girona;Sant Martí de Llémena;545
Catalunya;Girona;Sant Martí Vell;250
Catalunya;Girona;Sant Miquel de Campmajor;252
Catalunya;Girona;Sant Miquel de Fluvià;782
Catalunya;Girona;Sant Mori;180
Catalunya;Girona;Sant Pau de Segúries;717
Catalunya;Girona;Sant Pere Pescador;2029
Catalunya;Girona;Santa Coloma de Farners;11739
Catalunya;Girona;Santa Cristina d'Aro;5017
Catalunya;Girona;Santa Llogaia d'Àlguema;335
Catalunya;Girona;Santa Pau;1610
Catalunya;Girona;Sarrià de Ter;4468
Catalunya;Girona;Saus, Camallera i Llampaies;768
Catalunya;Girona;Selva de Mar (La);226
Catalunya;Girona;Serinyà;1095
Catalunya;Girona;Serra de Daró;194
Catalunya;Girona;Setcases;173
Catalunya;Girona;Sils;5127
Catalunya;Girona;Siurana;206
Catalunya;Girona;Susqueda;130
Catalunya;Girona;Tallada d'Empordà (La);420
Catalunya;Girona;Terrades;301
Catalunya;Girona;Torrent;193
Catalunya;Girona;Torroella de Fluvià;678
Catalunya;Girona;Torroella de Montgrí;11598
Catalunya;Girona;Tortellà;760
Catalunya;Girona;Toses;160
Catalunya;Girona;Tossa de Mar;5948
Catalunya;Girona;Ullà;1076
Catalunya;Girona;Ullastret;239
Catalunya;Girona;Ultramort;196
Catalunya;Girona;Urús;201
Catalunya;Girona;Vajol (La);98
Catalunya;Girona;Vall-llobrega;853
Catalunya;Girona;Vall d'en Bas (La);2780
Catalunya;Girona;Vall de Bianya (La);1321
Catalunya;Girona;Vallfogona de Ripollès;221
Catalunya;Girona;Ventalló;780
Catalunya;Girona;Verges;1162
Catalunya;Girona;Vidrà;173
Catalunya;Girona;Vidreres;7430
Catalunya;Girona;Vila-sacra;598
Catalunya;Girona;Vilabertran;882
Catalunya;Girona;Vilablareix;2283
Catalunya;Girona;Viladamat;466
Catalunya;Girona;Viladasens;217
Catalunya;Girona;Vilademuls;786
Catalunya;Girona;Viladrau;1100
Catalunya;Girona;Vilafant;5416
Catalunya;Girona;Vilajuïga;1149
Catalunya;Girona;Vilallonga de Ter;478
Catalunya;Girona;Vilamacolum;322
Catalunya;Girona;Vilamalla;1134
Catalunya;Girona;Vilamaniscle;169
Catalunya;Girona;Vilanant;356
Catalunya;Girona;Vilaür;140
Catalunya;Girona;Vilobí d'Onyar;2956
Catalunya;Girona;Vilopriu;221
Catalunya;Lleida;Abella de la Conca;183
Catalunya;Lleida;Àger;575
Catalunya;Lleida;Agramunt;5608
Catalunya;Lleida;Aitona;2398
Catalunya;Lleida;Alamús (Els);740
Catalunya;Lleida;Alàs i Cerc;391
Catalunya;Lleida;Albagés (L');476
Catalunya;Lleida;Albatàrrec;1872
Catalunya;Lleida;Albesa;1613
Catalunya;Lleida;Albi (L');836
Catalunya;Lleida;Alcanó;239
Catalunya;Lleida;Alcarràs;7776
Catalunya;Lleida;Alcoletge;2677
Catalunya;Lleida;Alfarràs;3155
Catalunya;Lleida;Alfés;318
Catalunya;Lleida;Algerri;469
Catalunya;Lleida;Alguaire;3165
Catalunya;Lleida;Alins;297
Catalunya;Lleida;Almacelles;6506
Catalunya;Lleida;Almatret;397
Catalunya;Lleida;Almenar;3669
Catalunya;Lleida;Alòs de Balaguer;146
Catalunya;Lleida;Alpicat;6058
Catalunya;Lleida;Alt Àneu;434
Catalunya;Lleida;Anglesola;1351
Catalunya;Lleida;Arbeca;2480
Catalunya;Lleida;Arres;68
Catalunya;Lleida;Arsèguel;93
Catalunya;Lleida;Artesa de Lleida;1517
Catalunya;Lleida;Artesa de Segre;3869
Catalunya;Lleida;Aspa;251
Catalunya;Lleida;Avellanes i Santa Linya (Les);467
Catalunya;Lleida;Baix Pallars;413
Catalunya;Lleida;Balaguer;16779
Catalunya;Lleida;Barbens;892
Catalunya;Lleida;Baronia de Rialb (La);279
Catalunya;Lleida;Bassella;252
Catalunya;Lleida;Bausen;63
Catalunya;Lleida;Belianes;589
Catalunya;Lleida;Bell-lloc d'Urgell;2447
Catalunya;Lleida;Bellaguarda;336
Catalunya;Lleida;Bellcaire d'Urgell;1284
Catalunya;Lleida;Bellmunt d'Urgell;215
Catalunya;Lleida;Bellpuig;4940
Catalunya;Lleida;Bellver de Cerdanya;2231
Catalunya;Lleida;Bellvís;2481
Catalunya;Lleida;Benavent de Segrià;1489
Catalunya;Lleida;Biosca;222
Catalunya;Lleida;Bòrdes (Es);238
Catalunya;Lleida;Borges Blanques (Les);6058
Catalunya;Lleida;Bossòst;1219
Catalunya;Lleida;Bovera;353
Catalunya;Lleida;Cabanabona;109
Catalunya;Lleida;Cabó;95
Catalunya;Lleida;Camarasa;991
Catalunya;Lleida;Canejan;104
Catalunya;Lleida;Castell de Mur;173
Catalunya;Lleida;Castellar de la Ribera;160
Catalunya;Lleida;Castelldans;1015
Catalunya;Lleida;Castellnou de Seana;739
Catalunya;Lleida;Castelló de Farfanya;572
Catalunya;Lleida;Castellserà;1131
Catalunya;Lleida;Cava;50
Catalunya;Lleida;Cervera;9328
Catalunya;Lleida;Cervià de les Garrigues;846
Catalunya;Lleida;Ciutadilla;226
Catalunya;Lleida;Clariana de Cardener;152
Catalunya;Lleida;Cogul (El);203
Catalunya;Lleida;Coll de Nargó;634
Catalunya;Lleida;Coma i la Pedra (La);278
Catalunya;Lleida;Conca de Dalt;410
Catalunya;Lleida;Corbins;1356
Catalunya;Lleida;Cubells;401
Catalunya;Lleida;Espluga Calba (L');429
Catalunya;Lleida;Espot;364
Catalunya;Lleida;Estamariu;115
Catalunya;Lleida;Estaràs;177
Catalunya;Lleida;Esterri d'Àneu;965
Catalunya;Lleida;Esterri de Cardós;75
Catalunya;Lleida;Farrera;133
Catalunya;Lleida;Fígols i Alinyà;284
Catalunya;Lleida;Floresta (La);179
Catalunya;Lleida;Fondarella;821
Catalunya;Lleida;Foradada;189
Catalunya;Lleida;Fuliola (La);1239
Catalunya;Lleida;Fulleda;113
Catalunya;Lleida;Gavet de la Conca;307
Catalunya;Lleida;Gimenells i el Pla de la Font;1182
Catalunya;Lleida;Golmés;1693
Catalunya;Lleida;Gósol;219
Catalunya;Lleida;Granadella (La);765
Catalunya;Lleida;Granja d'Escarp (La);984
Catalunya;Lleida;Granyanella;160
Catalunya;Lleida;Granyena de les Garrigues;172
Catalunya;Lleida;Granyena de Segarra;138
Catalunya;Lleida;Guimerà;334
Catalunya;Lleida;Guingueta d'Àneu (La);372
Catalunya;Lleida;Guissona;6145
Catalunya;Lleida;Guixers;138
Catalunya;Lleida;Isona i Conca Dellà;1163
Catalunya;Lleida;Ivars d'Urgell;1741
Catalunya;Lleida;Ivars de Noguera;363
Catalunya;Lleida;Ivorra;136
Catalunya;Lleida;Josa i Tuixén;155
Catalunya;Lleida;Juncosa;504
Catalunya;Lleida;Juneda;3417
Catalunya;Lleida;Les;979
Catalunya;Lleida;Linyola;2836
Catalunya;Lleida;Lladorre;227
Catalunya;Lleida;Lladurs;201
Catalunya;Lleida;Llardecans;533
Catalunya;Lleida;Llavorsí;374
Catalunya;Lleida;Lleida;135919
Catalunya;Lleida;Lles de Cerdanya;271
Catalunya;Lleida;Llimiana;168
Catalunya;Lleida;Llobera;211
Catalunya;Lleida;Maials;987
Catalunya;Lleida;Maldà;261
Catalunya;Lleida;Massalcoreig;593
Catalunya;Lleida;Massoteres;209
Catalunya;Lleida;Menàrguens;854
Catalunya;Lleida;Miralcamp;1440
Catalunya;Lleida;Mollerussa;14319
Catalunya;Lleida;Molsosa (La);119
Catalunya;Lleida;Montellà i Martinet;661
Catalunya;Lleida;Montferrer i Castellbò;1089
Catalunya;Lleida;Montgai;727
Catalunya;Lleida;Montoliu de Lleida;486
Catalunya;Lleida;Montoliu de Segarra;193
Catalunya;Lleida;Montornès de Segarra;108
Catalunya;Lleida;Nalec;95
Catalunya;Lleida;Naut Aran;1740
Catalunya;Lleida;Navès;266
Catalunya;Lleida;Odèn;281
Catalunya;Lleida;Oliana;1976
Catalunya;Lleida;Oliola;248
Catalunya;Lleida;Olius;814
Catalunya;Lleida;Oluges (Les);179
Catalunya;Lleida;Omellons (Els);244
Catalunya;Lleida;Omells de na Gaia (Els);142
Catalunya;Lleida;Organyà;958
Catalunya;Lleida;Os de Balaguer;985
Catalunya;Lleida;Ossó de Sió;219
Catalunya;Lleida;Palau d'Anglesola (El);2099
Catalunya;Lleida;Penelles;546
Catalunya;Lleida;Peramola;379
Catalunya;Lleida;Pinell de Solsonès;214
Catalunya;Lleida;Pinós;308
Catalunya;Lleida;Plans de Sió (Els);573
Catalunya;Lleida;Poal (El);659
Catalunya;Lleida;Pobla de Cérvoles (La);257
Catalunya;Lleida;Pobla de Segur (La);3237
Catalunya;Lleida;Pont de Bar (El);197
Catalunya;Lleida;Pont de Suert (El);2570
Catalunya;Lleida;Ponts;2803
Catalunya;Lleida;Portella (La);775
Catalunya;Lleida;Prats i Sansor;237
Catalunya;Lleida;Preixana;433
Catalunya;Lleida;Preixens;506
Catalunya;Lleida;Prullans;232
Catalunya;Lleida;Puiggròs;309
Catalunya;Lleida;Puigverd d'Agramunt;278
Catalunya;Lleida;Puigverd de Lleida;1391
Catalunya;Lleida;Rialp;656
Catalunya;Lleida;Ribera d'Ondara;445
Catalunya;Lleida;Ribera d'Urgellet;954
Catalunya;Lleida;Riner;300
Catalunya;Lleida;Riu de Cerdanya;110
Catalunya;Lleida;Rosselló;2912
Catalunya;Lleida;Salàs de Pallars;342
Catalunya;Lleida;Sanaüja;457
Catalunya;Lleida;Sant Esteve de la Sarga;143
Catalunya;Lleida;Sant Guim de Freixenet;1126
Catalunya;Lleida;Sant Guim de la Plana;191
Catalunya;Lleida;Sant Llorenç de Morunys;1084
Catalunya;Lleida;Sant Martí de Riucorb;697
Catalunya;Lleida;Sant Ramon;563
Catalunya;Lleida;Sarroca de Bellera;133
Catalunya;Lleida;Sarroca de Lleida;432
Catalunya;Lleida;Senterada;145
Catalunya;Lleida;Sentiu de Sió (La);496
Catalunya;Lleida;Seròs;1864
Catalunya;Lleida;Seu d'Urgell (La);13063
Catalunya;Lleida;Sidamon;756
Catalunya;Lleida;Soleràs (El);398
Catalunya;Lleida;Solsona;9233
Catalunya;Lleida;Soriguera;370
Catalunya;Lleida;Sort;2382
Catalunya;Lleida;Soses;1716
Catalunya;Lleida;Sudanell;887
Catalunya;Lleida;Sunyer;296
Catalunya;Lleida;Talarn;397
Catalunya;Lleida;Talavera;297
Catalunya;Lleida;Tàrrega;16539
Catalunya;Lleida;Tarrés;108
Catalunya;Lleida;Tarroja de Segarra;178
Catalunya;Lleida;Térmens;1536
Catalunya;Lleida;Tírvia;143
Catalunya;Lleida;Tiurana;85
Catalunya;Lleida;Torà;1367
Catalunya;Lleida;Torms (Els);174
Catalunya;Lleida;Tornabous;857
Catalunya;Lleida;Torre-serona;358
Catalunya;Lleida;Torre de Cabdella (La);811
Catalunya;Lleida;Torrebesses;300
Catalunya;Lleida;Torrefarrera;3911
Catalunya;Lleida;Torrefeta i Florejacs;633
Catalunya;Lleida;Torregrossa;2255
Catalunya;Lleida;Torrelameu;685
Catalunya;Lleida;Torres de Segre;2052
Catalunya;Lleida;Tremp;6228
Catalunya;Lleida;Vall de Boí (La);1090
Catalunya;Lleida;Vall de Cardós;420
Catalunya;Lleida;Vallbona de les Monges;251
Catalunya;Lleida;Vallfogona de Balaguer;1769
Catalunya;Lleida;Valls d'Aguilar (Les);307
Catalunya;Lleida;Valls de Valira (Les);832
Catalunya;Lleida;Vansa i Fórnols (La);213
Catalunya;Lleida;Verdú;1025
Catalunya;Lleida;Vielha e Mijaran;5710
Catalunya;Lleida;Vila-sana;696
Catalunya;Lleida;Vilagrassa;455
Catalunya;Lleida;Vilaller;715
Catalunya;Lleida;Vilamòs;174
Catalunya;Lleida;Vilanova de Bellpuig;1170
Catalunya;Lleida;Vilanova de l'Aguda;234
Catalunya;Lleida;Vilanova de la Barca;1273
Catalunya;Lleida;Vilanova de Meià;418
Catalunya;Lleida;Vilanova de Segrià;845
Catalunya;Lleida;Vilosell (El);200
Catalunya;Lleida;Vinaixa;607
Catalunya;Tarragona;Aiguamúrcia;906
Catalunya;Tarragona;Albinyana;2275
Catalunya;Tarragona;Albiol (L');405
Catalunya;Tarragona;Alcanar;10570
Catalunya;Tarragona;Alcover;5100
Catalunya;Tarragona;Aldea (L');4063
Catalunya;Tarragona;Aldover;984
Catalunya;Tarragona;Aleixar (L');898
Catalunya;Tarragona;Alfara de Carles;400
Catalunya;Tarragona;Alforja;1851
Catalunya;Tarragona;Alió;384
Catalunya;Tarragona;Almoster;1357
Catalunya;Tarragona;Altafulla;4685
Catalunya;Tarragona;Ametlla de Mar (L');7592
Catalunya;Tarragona;Ampolla (L');3118
Catalunya;Tarragona;Amposta;21240
Catalunya;Tarragona;Arboç (L');5441
Catalunya;Tarragona;Arbolí;112
Catalunya;Tarragona;Argentera (L');134
Catalunya;Tarragona;Arnes;488
Catalunya;Tarragona;Ascó;1608
Catalunya;Tarragona;Banyeres del Penedès;2945
Catalunya;Tarragona;Barberà de la Conca;539
Catalunya;Tarragona;Batea;2163
Catalunya;Tarragona;Bellmunt del Priorat;354
Catalunya;Tarragona;Bellvei;2005
Catalunya;Tarragona;Benifallet;788
Catalunya;Tarragona;Benissanet;1250
Catalunya;Tarragona;Bisbal de Falset (La);237
Catalunya;Tarragona;Bisbal del Penedès (La);3397
Catalunya;Tarragona;Blancafort;438
Catalunya;Tarragona;Bonastre;657
Catalunya;Tarragona;Borges del Camp (Les);2115
Catalunya;Tarragona;Bot;698
Catalunya;Tarragona;Botarell;1047
Catalunya;Tarragona;Bràfim;666
Catalunya;Tarragona;Cabacés;345
Catalunya;Tarragona;Cabra del Camp;1116
Catalunya;Tarragona;Calafell;24265
Catalunya;Tarragona;Camarles;3555
Catalunya;Tarragona;Cambrils;31720
Catalunya;Tarragona;Capafonts;119
Catalunya;Tarragona;Capçanes;415
Catalunya;Tarragona;Caseres;293
Catalunya;Tarragona;Castellvell del Camp;2686
Catalunya;Tarragona;Catllar (El);4079
Catalunya;Tarragona;Colldejou;183
Catalunya;Tarragona;Conesa;124
Catalunya;Tarragona;Constantí;6373
Catalunya;Tarragona;Corbera d'Ebre;1174
Catalunya;Tarragona;Cornudella de Montsant;1015
Catalunya;Tarragona;Creixell;3219
Catalunya;Tarragona;Cunit;12279
Catalunya;Tarragona;Deltebre;11751
Catalunya;Tarragona;Duesaigües;240
Catalunya;Tarragona;Espluga de Francolí (L');3982
Catalunya;Tarragona;Falset;2864
Catalunya;Tarragona;Fatarella (La);1128
Catalunya;Tarragona;Febró (La);46
Catalunya;Tarragona;Figuera (La);148
Catalunya;Tarragona;Figuerola del Camp;341
Catalunya;Tarragona;Flix;4098
Catalunya;Tarragona;Forès;43
Catalunya;Tarragona;Freginals;449
Catalunya;Tarragona;Galera (La);884
Catalunya;Tarragona;Gandesa;3236
Catalunya;Tarragona;Garcia;602
Catalunya;Tarragona;Garidells (Els);221
Catalunya;Tarragona;Ginestar;1066
Catalunya;Tarragona;Godall;841
Catalunya;Tarragona;Gratallops;266
Catalunya;Tarragona;Guiamets (Els);330
Catalunya;Tarragona;Horta de Sant Joan;1305
Catalunya;Tarragona;Lloar (El);117
Catalunya;Tarragona;Llorac;108
Catalunya;Tarragona;Llorenç del Penedès;2185
Catalunya;Tarragona;Marçà;649
Catalunya;Tarragona;Margalef;117
Catalunya;Tarragona;Mas de Barberans;663
Catalunya;Tarragona;Masdenverge;1133
Catalunya;Tarragona;Masllorenç;532
Catalunya;Tarragona;Masó (La);298
Catalunya;Tarragona;Maspujols;663
Catalunya;Tarragona;Masroig (El);566
Catalunya;Tarragona;Milà (El);178
Catalunya;Tarragona;Miravet;814
Catalunya;Tarragona;Molar (El);302
Catalunya;Tarragona;Mont-ral;171
Catalunya;Tarragona;Mont-roig del Camp;11847
Catalunya;Tarragona;Montblanc;7305
Catalunya;Tarragona;Montbrió del Camp;2219
Catalunya;Tarragona;Montferri;366
Catalunya;Tarragona;Montmell (El);1431
Catalunya;Tarragona;Móra d'Ebre;5695
Catalunya;Tarragona;Móra la Nova;3179
Catalunya;Tarragona;Morell (El);3285
Catalunya;Tarragona;Morera de Montsant (La);153
Catalunya;Tarragona;Nou de Gaià (La);497
Catalunya;Tarragona;Nulles;418
Catalunya;Tarragona;Pallaresos (Els);3991
Catalunya;Tarragona;Palma d'Ebre (La);413
Catalunya;Tarragona;Passanant i Belltall;159
Catalunya;Tarragona;Paüls;613
Catalunya;Tarragona;Perafort;1154
Catalunya;Tarragona;Perelló (El);3235
Catalunya;Tarragona;Piles (Les);215
Catalunya;Tarragona;Pinell de Brai (El);1130
Catalunya;Tarragona;Pira;510
Catalunya;Tarragona;Pla de Santa Maria (El);2309
Catalunya;Tarragona;Pobla de Mafumet (La);2403
Catalunya;Tarragona;Pobla de Massaluca (La);399
Catalunya;Tarragona;Pobla de Montornès (La);2852
Catalunya;Tarragona;Poboleda;371
Catalunya;Tarragona;Pont d'Armentera (El);620
Catalunya;Tarragona;Pontils;147
Catalunya;Tarragona;Porrera;480
Catalunya;Tarragona;Pradell de la Teixeta;182
Catalunya;Tarragona;Prades;676
Catalunya;Tarragona;Prat de Comte;205
Catalunya;Tarragona;Pratdip;843
Catalunya;Tarragona;Puigpelat;977
Catalunya;Tarragona;Querol;539
Catalunya;Tarragona;Rasquera;955
Catalunya;Tarragona;Renau;90
Catalunya;Tarragona;Reus;107118
Catalunya;Tarragona;Riba-roja d'Ebre;1348
Catalunya;Tarragona;Riba (La);722
Catalunya;Tarragona;Riera de Gaià (La);1587
Catalunya;Tarragona;Riudecanyes;1083
Catalunya;Tarragona;Riudecols;1296
Catalunya;Tarragona;Riudoms;6436
Catalunya;Tarragona;Rocafort de Queralt;278
Catalunya;Tarragona;Roda de Barà;6186
Catalunya;Tarragona;Rodonyà;508
Catalunya;Tarragona;Roquetes;8223
Catalunya;Tarragona;Rourell (El);380
Catalunya;Tarragona;Salomó;501
Catalunya;Tarragona;Salou;26649
Catalunya;Tarragona;Sant Carles de la Ràpita;15511
Catalunya;Tarragona;Sant Jaume d'Enveja;3528
Catalunya;Tarragona;Sant Jaume dels Domenys;2388
Catalunya;Tarragona;Santa Bàrbara;3955
Catalunya;Tarragona;Santa Coloma de Queralt;3167
Catalunya;Tarragona;Santa Oliva;3240
Catalunya;Tarragona;Sarral;1715
Catalunya;Tarragona;Savallà del Comtat;71
Catalunya;Tarragona;Secuita (La);1522
Catalunya;Tarragona;Selva del Camp (La);5376
Catalunya;Tarragona;Senan;59
Catalunya;Tarragona;Sénia (La);6179
Catalunya;Tarragona;Solivella;685
Catalunya;Tarragona;Tarragona;140323
Catalunya;Tarragona;Tivenys;959
Catalunya;Tarragona;Tivissa;1815
Catalunya;Tarragona;Torre de Fontaubella (La);147
Catalunya;Tarragona;Torre de l'Espanyol (La);678
Catalunya;Tarragona;Torredembarra;15272
Catalunya;Tarragona;Torroja del Priorat;165
Catalunya;Tarragona;Tortosa;35143
Catalunya;Tarragona;Ulldecona;7236
Catalunya;Tarragona;Ulldemolins;481
Catalunya;Tarragona;Vallclara;123
Catalunya;Tarragona;Vallfogona de Riucorb;119
Catalunya;Tarragona;Vallmoll;1630
Catalunya;Tarragona;Valls;25092
Catalunya;Tarragona;Vandellòs i l'Hospitalet de l'Infant;5754
Catalunya;Tarragona;Vendrell (El);35821
Catalunya;Tarragona;Vespella de Gaià;404
Catalunya;Tarragona;Vila-rodona;1260
Catalunya;Tarragona;Vila-seca;20866
Catalunya;Tarragona;Vilabella;799
Catalunya;Tarragona;Vilalba dels Arcs;724
Catalunya;Tarragona;Vilallonga del Camp;1889
Catalunya;Tarragona;Vilanova d'Escornalbou;559
Catalunya;Tarragona;Vilanova de Prades;144
Catalunya;Tarragona;Vilaplana;614
Catalunya;Tarragona;Vilaverd;494
Catalunya;Tarragona;Vilella Alta (La);114
Catalunya;Tarragona;Vilella Baixa (La);206
Catalunya;Tarragona;Vimbodí i Poblet;1077
Catalunya;Tarragona;Vinebre;483
Catalunya;Tarragona;Vinyols i els Arcs;1829
Catalunya;Tarragona;Xerta;1300
Ceuta y Melilla;Ceuta;Ceuta;78674
Ceuta y Melilla;Melilla;Melilla;73460
Extremadura;Badajoz;Acedera;821
Extremadura;Badajoz;Aceuchal;5679
Extremadura;Badajoz;Ahillones;1052
Extremadura;Badajoz;Alange;2005
Extremadura;Badajoz;Albuera (La);1986
Extremadura;Badajoz;Alburquerque;5704
Extremadura;Badajoz;Alconchel;1951
Extremadura;Badajoz;Alconera;737
Extremadura;Badajoz;Aljucén;252
Extremadura;Badajoz;Almendral;1307
Extremadura;Badajoz;Almendralejo;33588
Extremadura;Badajoz;Arroyo de San Serván;4276
Extremadura;Badajoz;Atalaya;338
Extremadura;Badajoz;Azuaga;8301
Extremadura;Badajoz;Badajoz;148334
Extremadura;Badajoz;Barcarrota;3698
Extremadura;Badajoz;Baterno;352
Extremadura;Badajoz;Benquerencia de la Serena;948
Extremadura;Badajoz;Berlanga;2484
Extremadura;Badajoz;Bienvenida;2326
Extremadura;Badajoz;Bodonal de la Sierra;1139
Extremadura;Badajoz;Burguillos del Cerro;3286
Extremadura;Badajoz;Cabeza del Buey;5411
Extremadura;Badajoz;Cabeza la Vaca;1479
Extremadura;Badajoz;Calamonte;6178
Extremadura;Badajoz;Calera de León;1060
Extremadura;Badajoz;Calzadilla de los Barros;863
Extremadura;Badajoz;Campanario;5367
Extremadura;Badajoz;Campillo de Llerena;1518
Extremadura;Badajoz;Capilla;187
Extremadura;Badajoz;Carmonita;581
Extremadura;Badajoz;Carrascalejo (El);85
Extremadura;Badajoz;Casas de Don Pedro;1632
Extremadura;Badajoz;Casas de Reina;196
Extremadura;Badajoz;Castilblanco;1151
Extremadura;Badajoz;Castuera;6594
Extremadura;Badajoz;Cheles;1287
Extremadura;Badajoz;Codosera (La);2322
Extremadura;Badajoz;Cordobilla de Lácara;967
Extremadura;Badajoz;Coronada (La);2239
Extremadura;Badajoz;Corte de Peleas;1307
Extremadura;Badajoz;Cristina;562
Extremadura;Badajoz;Don Álvaro;743
Extremadura;Badajoz;Don Benito;35791
Extremadura;Badajoz;Entrín Bajo;602
Extremadura;Badajoz;Esparragalejo;1580
Extremadura;Badajoz;Esparragosa de la Serena;1088
Extremadura;Badajoz;Esparragosa de Lares;1021
Extremadura;Badajoz;Feria;1341
Extremadura;Badajoz;Fregenal de la Sierra;5237
Extremadura;Badajoz;Fuenlabrada de los Montes;1955
Extremadura;Badajoz;Fuente de Cantos;5039
Extremadura;Badajoz;Fuente del Arco;750
Extremadura;Badajoz;Fuente del Maestre;6962
Extremadura;Badajoz;Fuentes de León;2571
Extremadura;Badajoz;Garbayuela;547
Extremadura;Badajoz;Garlitos;681
Extremadura;Badajoz;Garrovilla (La);2506
Extremadura;Badajoz;Granja de Torrehermosa;2377
Extremadura;Badajoz;Guareña;7312
Extremadura;Badajoz;Haba (La);1367
Extremadura;Badajoz;Helechosa de los Montes;716
Extremadura;Badajoz;Herrera del Duque;3688
Extremadura;Badajoz;Higuera de la Serena;1043
Extremadura;Badajoz;Higuera de Llerena;353
Extremadura;Badajoz;Higuera de Vargas;2154
Extremadura;Badajoz;Higuera la Real;2474
Extremadura;Badajoz;Hinojosa del Valle;558
Extremadura;Badajoz;Hornachos;3867
Extremadura;Badajoz;Jerez de los Caballeros;10237
Extremadura;Badajoz;Lapa (La);296
Extremadura;Badajoz;Llera;947
Extremadura;Badajoz;Llerena;5997
Extremadura;Badajoz;Lobón;2723
Extremadura;Badajoz;Magacela;607
Extremadura;Badajoz;Maguilla;1084
Extremadura;Badajoz;Malcocinado;449
Extremadura;Badajoz;Malpartida de la Serena;662
Extremadura;Badajoz;Manchita;764
Extremadura;Badajoz;Medellín;2337
Extremadura;Badajoz;Medina de las Torres;1338
Extremadura;Badajoz;Mengabril;487
Extremadura;Badajoz;Mérida;56395
Extremadura;Badajoz;Mirandilla;1377
Extremadura;Badajoz;Monesterio;4378
Extremadura;Badajoz;Montemolín;1534
Extremadura;Badajoz;Monterrubio de la Serena;2710
Extremadura;Badajoz;Montijo;16236
Extremadura;Badajoz;Morera (La);752
Extremadura;Badajoz;Nava de Santiago (La);1089
Extremadura;Badajoz;Navalvillar de Pela;4787
Extremadura;Badajoz;Nogales;724
Extremadura;Badajoz;Oliva de la Frontera;5612
Extremadura;Badajoz;Oliva de Mérida;1875
Extremadura;Badajoz;Olivenza;11852
Extremadura;Badajoz;Orellana de la Sierra;311
Extremadura;Badajoz;Orellana la Vieja;3015
Extremadura;Badajoz;Palomas;701
Extremadura;Badajoz;Parra (La);1390
Extremadura;Badajoz;Peñalsordo;1210
Extremadura;Badajoz;Peraleda del Zaucejo;608
Extremadura;Badajoz;Puebla de Alcocer;1272
Extremadura;Badajoz;Puebla de la Calzada;5903
Extremadura;Badajoz;Puebla de la Reina;860
Extremadura;Badajoz;Puebla de Obando;1988
Extremadura;Badajoz;Puebla de Sancho Pérez;2899
Extremadura;Badajoz;Puebla del Maestre;777
Extremadura;Badajoz;Puebla del Prior;545
Extremadura;Badajoz;Pueblonuevo del Guadiana;2018
Extremadura;Badajoz;Quintana de la Serena;5069
Extremadura;Badajoz;Reina;201
Extremadura;Badajoz;Rena;669
Extremadura;Badajoz;Retamal de Llerena;501
Extremadura;Badajoz;Ribera del Fresno;3466
Extremadura;Badajoz;Risco;166
Extremadura;Badajoz;Roca de la Sierra (La);1526
Extremadura;Badajoz;Salvaleón;2049
Extremadura;Badajoz;Salvatierra de los Barros;1788
Extremadura;Badajoz;San Pedro de Mérida;880
Extremadura;Badajoz;San Vicente de Alcántara;5808
Extremadura;Badajoz;Sancti-Spíritus;237
Extremadura;Badajoz;Santa Amalia;4326
Extremadura;Badajoz;Santa Marta;4322
Extremadura;Badajoz;Santos de Maimona (Los);8193
Extremadura;Badajoz;Segura de León;2140
Extremadura;Badajoz;Siruela;2192
Extremadura;Badajoz;Solana de los Barros;2826
Extremadura;Badajoz;Talarrubias;3630
Extremadura;Badajoz;Talavera la Real;5509
Extremadura;Badajoz;Táliga;801
Extremadura;Badajoz;Tamurejo;259
Extremadura;Badajoz;Torre de Miguel Sesmero;1257
Extremadura;Badajoz;Torremayor;1004
Extremadura;Badajoz;Torremejía;2228
Extremadura;Badajoz;Trasierra;691
Extremadura;Badajoz;Trujillanos;1439
Extremadura;Badajoz;Usagre;1956
Extremadura;Badajoz;Valdecaballeros;1218
Extremadura;Badajoz;Valdelacalzada;2804
Extremadura;Badajoz;Valdetorres;1331
Extremadura;Badajoz;Valencia de las Torres;687
Extremadura;Badajoz;Valencia del Mombuey;782
Extremadura;Badajoz;Valencia del Ventoso;2249
Extremadura;Badajoz;Valle de la Serena;1425
Extremadura;Badajoz;Valle de Matamoros;423
Extremadura;Badajoz;Valle de Santa Ana;1192
Extremadura;Badajoz;Valverde de Burguillos;322
Extremadura;Badajoz;Valverde de Leganés;4155
Extremadura;Badajoz;Valverde de Llerena;714
Extremadura;Badajoz;Valverde de Mérida;1159
Extremadura;Badajoz;Villafranca de los Barros;13356
Extremadura;Badajoz;Villagarcía de la Torre;986
Extremadura;Badajoz;Villagonzalo;1348
Extremadura;Badajoz;Villalba de los Barros;1654
Extremadura;Badajoz;Villanueva de la Serena;25838
Extremadura;Badajoz;Villanueva del Fresno;3678
Extremadura;Badajoz;Villar de Rena;1457
Extremadura;Badajoz;Villar del Rey;2386
Extremadura;Badajoz;Villarta de los Montes;587
Extremadura;Badajoz;Zafra;16424
Extremadura;Badajoz;Zahínos;2906
Extremadura;Badajoz;Zalamea de la Serena;3978
Extremadura;Badajoz;Zarza-Capilla;403
Extremadura;Badajoz;Zarza (La);3563
Extremadura;Cáceres;Abadía;325
Extremadura;Cáceres;Abertura;454
Extremadura;Cáceres;Acebo;685
Extremadura;Cáceres;Acehúche;852
Extremadura;Cáceres;Aceituna;617
Extremadura;Cáceres;Ahigal;1457
Extremadura;Cáceres;Albalá;798
Extremadura;Cáceres;Alcántara;1653
Extremadura;Cáceres;Alcollarín;266
Extremadura;Cáceres;Alcuéscar;3010
Extremadura;Cáceres;Aldea del Cano;721
Extremadura;Cáceres;Aldea del Obispo (La);350
Extremadura;Cáceres;Aldeacentenera;774
Extremadura;Cáceres;Aldeanueva de la Vera;2275
Extremadura;Cáceres;Aldeanueva del Camino;800
Extremadura;Cáceres;Aldehuela de Jerte;338
Extremadura;Cáceres;Alía;1021
Extremadura;Cáceres;Aliseda;1982
Extremadura;Cáceres;Almaraz;1321
Extremadura;Cáceres;Almoharín;1997
Extremadura;Cáceres;Arroyo de la Luz;6517
Extremadura;Cáceres;Arroyomolinos;999
Extremadura;Cáceres;Arroyomolinos de la Vera;497
Extremadura;Cáceres;Baños de Montemayor;703
Extremadura;Cáceres;Barrado;477
Extremadura;Cáceres;Belvís de Monroy;670
Extremadura;Cáceres;Benquerencia;98
Extremadura;Cáceres;Berrocalejo;105
Extremadura;Cáceres;Berzocana;528
Extremadura;Cáceres;Bohonal de Ibor;535
Extremadura;Cáceres;Botija;199
Extremadura;Cáceres;Brozas;2123
Extremadura;Cáceres;Cabañas del Castillo;423
Extremadura;Cáceres;Cabezabellosa;418
Extremadura;Cáceres;Cabezuela del Valle;2129
Extremadura;Cáceres;Cabrero;369
Extremadura;Cáceres;Cáceres;93131
Extremadura;Cáceres;Cachorrilla;93
Extremadura;Cáceres;Cadalso;506
Extremadura;Cáceres;Calzadilla;485
Extremadura;Cáceres;Caminomorisco;1258
Extremadura;Cáceres;Campillo de Deleitosa;79
Extremadura;Cáceres;Campo Lugar;1030
Extremadura;Cáceres;Cañamero;1787
Extremadura;Cáceres;Cañaveral;1284
Extremadura;Cáceres;Carbajo;227
Extremadura;Cáceres;Carcaboso;1108
Extremadura;Cáceres;Carrascalejo;337
Extremadura;Cáceres;Casar de Cáceres;4879
Extremadura;Cáceres;Casar de Palomero;1378
Extremadura;Cáceres;Casares de las Hurdes;528
Extremadura;Cáceres;Casas de Don Antonio;213
Extremadura;Cáceres;Casas de Don Gómez;347
Extremadura;Cáceres;Casas de Millán;690
Extremadura;Cáceres;Casas de Miravete;145
Extremadura;Cáceres;Casas del Castañar;639
Extremadura;Cáceres;Casas del Monte;766
Extremadura;Cáceres;Casatejada;1399
Extremadura;Cáceres;Casillas de Coria;470
Extremadura;Cáceres;Castañar de Ibor;1225
Extremadura;Cáceres;Ceclavín;2054
Extremadura;Cáceres;Cedillo;497
Extremadura;Cáceres;Cerezo;190
Extremadura;Cáceres;Cilleros;1868
Extremadura;Cáceres;Collado;201
Extremadura;Cáceres;Conquista de la Sierra;210
Extremadura;Cáceres;Coria;12896
Extremadura;Cáceres;Cuacos de Yuste;915
Extremadura;Cáceres;Cumbre (La);982
Extremadura;Cáceres;Deleitosa;838
Extremadura;Cáceres;Descargamaría;190
Extremadura;Cáceres;Eljas;1033
Extremadura;Cáceres;Escurial;851
Extremadura;Cáceres;Fresnedoso de Ibor;329
Extremadura;Cáceres;Galisteo;1968
Extremadura;Cáceres;Garciaz;851
Extremadura;Cáceres;Garganta (La);490
Extremadura;Cáceres;Garganta la Olla;1062
Extremadura;Cáceres;Gargantilla;440
Extremadura;Cáceres;Gargüera;132
Extremadura;Cáceres;Garrovillas de Alconétar;2280
Extremadura;Cáceres;Garvín;105
Extremadura;Cáceres;Gata;1662
Extremadura;Cáceres;Gordo (El);338
Extremadura;Cáceres;Granja (La);361
Extremadura;Cáceres;Guadalupe;2096
Extremadura;Cáceres;Guijo de Coria;231
Extremadura;Cáceres;Guijo de Galisteo;1611
Extremadura;Cáceres;Guijo de Granadilla;625
Extremadura;Cáceres;Guijo de Santa Bárbara;410
Extremadura;Cáceres;Herguijuela;366
Extremadura;Cáceres;Hernán-Pérez;518
Extremadura;Cáceres;Herrera de Alcántara;285
Extremadura;Cáceres;Herreruela;386
Extremadura;Cáceres;Hervás;4126
Extremadura;Cáceres;Higuera;100
Extremadura;Cáceres;Hinojal;441
Extremadura;Cáceres;Holguera;758
Extremadura;Cáceres;Hoyos;976
Extremadura;Cáceres;Huélaga;196
Extremadura;Cáceres;Ibahernando;488
Extremadura;Cáceres;Jaraicejo;590
Extremadura;Cáceres;Jaraíz de la Vera;6467
Extremadura;Cáceres;Jarandilla de la Vera;3129
Extremadura;Cáceres;Jarilla;154
Extremadura;Cáceres;Jerte;1332
Extremadura;Cáceres;Ladrillar;228
Extremadura;Cáceres;Logrosán;2090
Extremadura;Cáceres;Losar de la Vera;2966
Extremadura;Cáceres;Madrigal de la Vera;1819
Extremadura;Cáceres;Madrigalejo;1953
Extremadura;Cáceres;Madroñera;2916
Extremadura;Cáceres;Majadas;1297
Extremadura;Cáceres;Malpartida de Cáceres;4469
Extremadura;Cáceres;Malpartida de Plasencia;4627
Extremadura;Cáceres;Marchagaz;248
Extremadura;Cáceres;Mata de Alcántara;330
Extremadura;Cáceres;Membrío;851
Extremadura;Cáceres;Mesas de Ibor;173
Extremadura;Cáceres;Miajadas;10338
Extremadura;Cáceres;Millanes;257
Extremadura;Cáceres;Mirabel;730
Extremadura;Cáceres;Mohedas de Granadilla;976
Extremadura;Cáceres;Monroy;994
Extremadura;Cáceres;Montánchez;2040
Extremadura;Cáceres;Montehermoso;5799
Extremadura;Cáceres;Moraleja;7998
Extremadura;Cáceres;Morcillo;418
Extremadura;Cáceres;Navaconcejo;2074
Extremadura;Cáceres;Navalmoral de la Mata;17228
Extremadura;Cáceres;Navalvillar de Ibor;504
Extremadura;Cáceres;Navas del Madroño;1444
Extremadura;Cáceres;Navezuelas;698
Extremadura;Cáceres;Nuñomoral;1435
Extremadura;Cáceres;Oliva de Plasencia;286
Extremadura;Cáceres;Palomero;452
Extremadura;Cáceres;Pasarón de la Vera;677
Extremadura;Cáceres;Pedroso de Acim;115
Extremadura;Cáceres;Peraleda de la Mata;1453
Extremadura;Cáceres;Peraleda de San Román;294
Extremadura;Cáceres;Perales del Puerto;970
Extremadura;Cáceres;Pescueza;157
Extremadura;Cáceres;Pesga (La);1123
Extremadura;Cáceres;Piedras Albas;207
Extremadura;Cáceres;Pinofranqueado;1687
Extremadura;Cáceres;Piornal;1537
Extremadura;Cáceres;Plasencia;41148
Extremadura;Cáceres;Plasenzuela;538
Extremadura;Cáceres;Portaje;415
Extremadura;Cáceres;Portezuelo;268
Extremadura;Cáceres;Pozuelo de Zarzón;564
Extremadura;Cáceres;Puerto de Santa Cruz;393
Extremadura;Cáceres;Rebollar;237
Extremadura;Cáceres;Riolobos;1257
Extremadura;Cáceres;Robledillo de Gata;124
Extremadura;Cáceres;Robledillo de la Vera;305
Extremadura;Cáceres;Robledillo de Trujillo;420
Extremadura;Cáceres;Robledollano;402
Extremadura;Cáceres;Romangordo;224
Extremadura;Cáceres;Rosalejo;1284
Extremadura;Cáceres;Ruanes;68
Extremadura;Cáceres;Salorino;689
Extremadura;Cáceres;Salvatierra de Santiago;302
Extremadura;Cáceres;San Martín de Trevejo;916
Extremadura;Cáceres;Santa Ana;299
Extremadura;Cáceres;Santa Cruz de la Sierra;270
Extremadura;Cáceres;Santa Cruz de Paniagua;315
Extremadura;Cáceres;Santa Marta de Magasca;309
Extremadura;Cáceres;Santiago de Alcántara;685
Extremadura;Cáceres;Santiago del Campo;307
Extremadura;Cáceres;Santibáñez el Alto;436
Extremadura;Cáceres;Santibáñez el Bajo;829
Extremadura;Cáceres;Saucedilla;804
Extremadura;Cáceres;Segura de Toro;186
Extremadura;Cáceres;Serradilla;1766
Extremadura;Cáceres;Serrejón;444
Extremadura;Cáceres;Sierra de Fuentes;2085
Extremadura;Cáceres;Talaván;923
Extremadura;Cáceres;Talaveruela de la Vera;365
Extremadura;Cáceres;Talayuela;9222
Extremadura;Cáceres;Tejeda de Tiétar;887
Extremadura;Cáceres;Toril;179
Extremadura;Cáceres;Tornavacas;1181
Extremadura;Cáceres;Torno (El);988
Extremadura;Cáceres;Torre de Don Miguel;568
Extremadura;Cáceres;Torre de Santa María;632
Extremadura;Cáceres;Torrecilla de los Ángeles;687
Extremadura;Cáceres;Torrecillas de la Tiesa;1179
Extremadura;Cáceres;Torrejón el Rubio;614
Extremadura;Cáceres;Torrejoncillo;3338
Extremadura;Cáceres;Torremenga;621
Extremadura;Cáceres;Torremocha;1038
Extremadura;Cáceres;Torreorgaz;1764
Extremadura;Cáceres;Torrequemada;604
Extremadura;Cáceres;Trujillo;9822
Extremadura;Cáceres;Valdastillas;380
Extremadura;Cáceres;Valdecañas de Tajo;119
Extremadura;Cáceres;Valdefuentes;1415
Extremadura;Cáceres;Valdehúncar;212
Extremadura;Cáceres;Valdelacasa de Tajo;455
Extremadura;Cáceres;Valdemorales;230
Extremadura;Cáceres;Valdeobispo;761
Extremadura;Cáceres;Valencia de Alcántara;6178
Extremadura;Cáceres;Valverde de la Vera;588
Extremadura;Cáceres;Valverde del Fresno;2509
Extremadura;Cáceres;Viandar de la Vera;266
Extremadura;Cáceres;Villa del Campo;555
Extremadura;Cáceres;Villa del Rey;157
Extremadura;Cáceres;Villamesías;311
Extremadura;Cáceres;Villamiel;675
Extremadura;Cáceres;Villanueva de la Sierra;514
Extremadura;Cáceres;Villanueva de la Vera;2108
Extremadura;Cáceres;Villar de Plasencia;229
Extremadura;Cáceres;Villar del Pedroso;673
Extremadura;Cáceres;Villasbuenas de Gata;456
Extremadura;Cáceres;Zarza de Granadilla;1864
Extremadura;Cáceres;Zarza de Montánchez;619
Extremadura;Cáceres;Zarza la Mayor;1409
Extremadura;Cáceres;Zorita;1673
Galicia;A Coruña;Abegondo;5798
Galicia;A Coruña;Ames;26983
Galicia;A Coruña;Aranga;2142
Galicia;A Coruña;Ares;5673
Galicia;A Coruña;Arteixo;29762
Galicia;A Coruña;Arzúa;6490
Galicia;A Coruña;Baña (A);4415
Galicia;A Coruña;Bergondo;6696
Galicia;A Coruña;Betanzos;13680
Galicia;A Coruña;Boimorto;2288
Galicia;A Coruña;Boiro;18883
Galicia;A Coruña;Boqueixón;4462
Galicia;A Coruña;Brión;7205
Galicia;A Coruña;Cabana de Bergantiños;4985
Galicia;A Coruña;Cabanas;3336
Galicia;A Coruña;Camariñas;6224
Galicia;A Coruña;Cambre;23231
Galicia;A Coruña;Capela (A);1417
Galicia;A Coruña;Carballo;30990
Galicia;A Coruña;Cariño;4590
Galicia;A Coruña;Carnota;4938
Galicia;A Coruña;Carral;5770
Galicia;A Coruña;Cedeira;7465
Galicia;A Coruña;Cee;7712
Galicia;A Coruña;Cerceda;5570
Galicia;A Coruña;Cerdido;1359
Galicia;A Coruña;Cesuras;2219
Galicia;A Coruña;Coirós;1713
Galicia;A Coruña;Corcubión;1815
Galicia;A Coruña;Coristanco;7285
Galicia;A Coruña;Coruña (A);246056
Galicia;A Coruña;Culleredo;28227
Galicia;A Coruña;Curtis;4246
Galicia;A Coruña;Dodro;3029
Galicia;A Coruña;Dumbría;3751
Galicia;A Coruña;Fene;14165
Galicia;A Coruña;Ferrol;74273
Galicia;A Coruña;Fisterra;5005
Galicia;A Coruña;Frades;2706
Galicia;A Coruña;Irixoa;1526
Galicia;A Coruña;Laracha (A);11171
Galicia;A Coruña;Laxe;3413
Galicia;A Coruña;Lousame;3687
Galicia;A Coruña;Malpica de Bergantiños;6228
Galicia;A Coruña;Mañón;1622
Galicia;A Coruña;Mazaricos;4939
Galicia;A Coruña;Melide;7874
Galicia;A Coruña;Mesía;2975
Galicia;A Coruña;Miño;5488
Galicia;A Coruña;Moeche;1416
Galicia;A Coruña;Monfero;2299
Galicia;A Coruña;Mugardos;5565
Galicia;A Coruña;Muros;9787
Galicia;A Coruña;Muxía;5510
Galicia;A Coruña;Narón;37712
Galicia;A Coruña;Neda;5528
Galicia;A Coruña;Negreira;6941
Galicia;A Coruña;Noia;14970
Galicia;A Coruña;Oleiros;33443
Galicia;A Coruña;Ordes;12757
Galicia;A Coruña;Oroso;6987
Galicia;A Coruña;Ortigueira;7150
Galicia;A Coruña;Outes;7425
Galicia;A Coruña;Oza dos Ríos;3202
Galicia;A Coruña;Paderne;2672
Galicia;A Coruña;Padrón;8968
Galicia;A Coruña;Pino (O);4710
Galicia;A Coruña;Pobra do Caramiñal (A);9878
Galicia;A Coruña;Ponteceso;6302
Galicia;A Coruña;Pontedeume;8457
Galicia;A Coruña;Pontes de García Rodríguez (As);11431
Galicia;A Coruña;Porto do Son;9867
Galicia;A Coruña;Rianxo;11769
Galicia;A Coruña;Ribeira;27518
Galicia;A Coruña;Rois;4995
Galicia;A Coruña;Sada;14487
Galicia;A Coruña;San Sadurniño;3119
Galicia;A Coruña;Santa Comba;10487
Galicia;A Coruña;Santiago de Compostela;95092
Galicia;A Coruña;Santiso;1980
Galicia;A Coruña;Sobrado;2168
Galicia;A Coruña;Somozas (As);1382
Galicia;A Coruña;Teo;17807
Galicia;A Coruña;Toques;1405
Galicia;A Coruña;Tordoia;4339
Galicia;A Coruña;Touro;4230
Galicia;A Coruña;Trazo;3498
Galicia;A Coruña;Val do Dubra;4423
Galicia;A Coruña;Valdoviño;6978
Galicia;A Coruña;Vedra;5059
Galicia;A Coruña;Vilarmaior;1294
Galicia;A Coruña;Vilasantar;1415
Galicia;A Coruña;Vimianzo;8204
Galicia;A Coruña;Zas;5385
Galicia;Lugo;Abadín;2896
Galicia;Lugo;Alfoz;2107
Galicia;Lugo;Antas de Ulla;2407
Galicia;Lugo;Baleira;1584
Galicia;Lugo;Baralla;2955
Galicia;Lugo;Barreiros;3244
Galicia;Lugo;Becerreá;3250
Galicia;Lugo;Begonte;3475
Galicia;Lugo;Bóveda;1669
Galicia;Lugo;Burela;9381
Galicia;Lugo;Carballedo;2752
Galicia;Lugo;Castro de Rei;5685
Galicia;Lugo;Castroverde;3061
Galicia;Lugo;Cervantes;1731
Galicia;Lugo;Cervo;4685
Galicia;Lugo;Chantada;9014
Galicia;Lugo;Corgo (O);3993
Galicia;Lugo;Cospeito;5231
Galicia;Lugo;Folgoso do Courel;1233
Galicia;Lugo;Fonsagrada (A);4520
Galicia;Lugo;Foz;9970
Galicia;Lugo;Friol;4348
Galicia;Lugo;Guitiriz;5896
Galicia;Lugo;Guntín;3129
Galicia;Lugo;Incio (O);2087
Galicia;Lugo;Láncara;2992
Galicia;Lugo;Lourenzá;2542
Galicia;Lugo;Lugo;96678
Galicia;Lugo;Meira;1800
Galicia;Lugo;Mondoñedo;4508
Galicia;Lugo;Monforte de Lemos;19546
Galicia;Lugo;Monterroso;4241
Galicia;Lugo;Muras;830
Galicia;Lugo;Navia de Suarna;1441
Galicia;Lugo;Negueira de Muñiz;210
Galicia;Lugo;Nogais (As);1381
Galicia;Lugo;Ourol;1216
Galicia;Lugo;Outeiro de Rei;4852
Galicia;Lugo;Palas de Rei;3678
Galicia;Lugo;Pantón;2978
Galicia;Lugo;Paradela;2143
Galicia;Lugo;Páramo (O);1686
Galicia;Lugo;Pastoriza (A);3566
Galicia;Lugo;Pedrafita do Cebreiro;1298
Galicia;Lugo;Pobra do Brollón (A);2105
Galicia;Lugo;Pol;1865
Galicia;Lugo;Pontenova (A);2892
Galicia;Lugo;Portomarín;1796
Galicia;Lugo;Quiroga;3829
Galicia;Lugo;Rábade;1711
Galicia;Lugo;Ribadeo;9983
Galicia;Lugo;Ribas de Sil;1144
Galicia;Lugo;Ribeira de Piquín;687
Galicia;Lugo;Riotorto;1522
Galicia;Lugo;Samos;1707
Galicia;Lugo;Sarria;13508
Galicia;Lugo;Saviñao (O);4570
Galicia;Lugo;Sober;2681
Galicia;Lugo;Taboada;3464
Galicia;Lugo;Trabada;1392
Galicia;Lugo;Triacastela;781
Galicia;Lugo;Valadouro (O);2209
Galicia;Lugo;Vicedo (O);2011
Galicia;Lugo;Vilalba;15437
Galicia;Lugo;Viveiro;16238
Galicia;Lugo;Xermade;2256
Galicia;Lugo;Xove;3518
Galicia;Ourense;Allariz;5821
Galicia;Ourense;Amoeiro;2327
Galicia;Ourense;Arnoia (A);1103
Galicia;Ourense;Avión;2610
Galicia;Ourense;Baltar;1144
Galicia;Ourense;Bande;2116
Galicia;Ourense;Baños de Molgas;1846
Galicia;Ourense;Barbadás;9177
Galicia;Ourense;Barco de Valdeorras (O);14213
Galicia;Ourense;Beade;521
Galicia;Ourense;Beariz;1319
Galicia;Ourense;Blancos (Os);1030
Galicia;Ourense;Boborás;3001
Galicia;Ourense;Bola (A);1486
Galicia;Ourense;Bolo (O);1139
Galicia;Ourense;Calvos de Randín;1093
Galicia;Ourense;Carballeda de Avia;1546
Galicia;Ourense;Carballeda de Valdeorras;1870
Galicia;Ourense;Carballiño (O);14114
Galicia;Ourense;Cartelle;3387
Galicia;Ourense;Castrelo de Miño;1928
Galicia;Ourense;Castrelo do Val;1241
Galicia;Ourense;Castro Caldelas;1594
Galicia;Ourense;Celanova;6020
Galicia;Ourense;Cenlle;1431
Galicia;Ourense;Chandrexa de Queixa;679
Galicia;Ourense;Coles;3214
Galicia;Ourense;Cortegada;1344
Galicia;Ourense;Cualedro;2049
Galicia;Ourense;Entrimo;1367
Galicia;Ourense;Esgos;1234
Galicia;Ourense;Gomesende;1018
Galicia;Ourense;Gudiña (A);1584
Galicia;Ourense;Irixo (O);1828
Galicia;Ourense;Larouco;581
Galicia;Ourense;Laza;1597
Galicia;Ourense;Leiro;1793
Galicia;Ourense;Lobeira;1016
Galicia;Ourense;Lobios;2259
Galicia;Ourense;Maceda;3139
Galicia;Ourense;Manzaneda;1028
Galicia;Ourense;Maside;3096
Galicia;Ourense;Melón;1498
Galicia;Ourense;Merca (A);2254
Galicia;Ourense;Mezquita (A);1365
Galicia;Ourense;Montederramo;990
Galicia;Ourense;Monterrei;3036
Galicia;Ourense;Muíños;1821
Galicia;Ourense;Nogueira de Ramuín;2435
Galicia;Ourense;Oímbra;1916
Galicia;Ourense;Ourense;107742
Galicia;Ourense;Paderne de Allariz;1597
Galicia;Ourense;Padrenda;2367
Galicia;Ourense;Parada de Sil;683
Galicia;Ourense;Pereiro de Aguiar (O);6135
Galicia;Ourense;Peroxa (A);2303
Galicia;Ourense;Petín;1030
Galicia;Ourense;Piñor;1401
Galicia;Ourense;Pobra de Trives (A);2549
Galicia;Ourense;Pontedeva;680
Galicia;Ourense;Porqueira;1103
Galicia;Ourense;Punxín;861
Galicia;Ourense;Quintela de Leirado;754
Galicia;Ourense;Rairiz de Veiga;1697
Galicia;Ourense;Ramirás;1938
Galicia;Ourense;Ribadavia;5519
Galicia;Ourense;Riós;1907
Galicia;Ourense;Rúa (A);4816
Galicia;Ourense;Rubiá;1585
Galicia;Ourense;San Amaro;1289
Galicia;Ourense;San Cibrao das Viñas;4310
Galicia;Ourense;San Cristovo de Cea;2739
Galicia;Ourense;San Xoán de Río;759
Galicia;Ourense;Sandiás;1466
Galicia;Ourense;Sarreaus;1587
Galicia;Ourense;Taboadela;1697
Galicia;Ourense;Teixeira (A);479
Galicia;Ourense;Toén;2635
Galicia;Ourense;Trasmiras;1656
Galicia;Ourense;Veiga (A);1106
Galicia;Ourense;Verea;1269
Galicia;Ourense;Verín;14391
Galicia;Ourense;Viana do Bolo;3382
Galicia;Ourense;Vilamarín;2215
Galicia;Ourense;Vilamartín de Valdeorras;2164
Galicia;Ourense;Vilar de Barrio;1686
Galicia;Ourense;Vilar de Santos;991
Galicia;Ourense;Vilardevós;2324
Galicia;Ourense;Vilariño de Conso;700
Galicia;Ourense;Xinzo de Limia;10161
Galicia;Ourense;Xunqueira de Ambía;1789
Galicia;Ourense;Xunqueira de Espadanedo;962
Galicia;Pontevedra;Agolada;3094
Galicia;Pontevedra;Arbo;3833
Galicia;Pontevedra;Baiona;12091
Galicia;Pontevedra;Barro;3583
Galicia;Pontevedra;Bueu;12331
Galicia;Pontevedra;Caldas de Reis;10036
Galicia;Pontevedra;Cambados;13708
Galicia;Pontevedra;Campo Lameiro;2084
Galicia;Pontevedra;Cangas;25748
Galicia;Pontevedra;Cañiza (A);6583
Galicia;Pontevedra;Catoira;3473
Galicia;Pontevedra;Cerdedo;2290
Galicia;Pontevedra;Cotobade;4448
Galicia;Pontevedra;Covelo;3399
Galicia;Pontevedra;Crecente;2596
Galicia;Pontevedra;Cuntis;5133
Galicia;Pontevedra;Dozón;1827
Galicia;Pontevedra;Estrada (A);21880
Galicia;Pontevedra;Forcarei;4219
Galicia;Pontevedra;Fornelos de Montes;1976
Galicia;Pontevedra;Gondomar;13841
Galicia;Pontevedra;Grove (O);11250
Galicia;Pontevedra;Guarda (A);10425
Galicia;Pontevedra;Illa de Arousa (A);4982
Galicia;Pontevedra;Lalín;21254
Galicia;Pontevedra;Lama (A);3001
Galicia;Pontevedra;Marín;25969
Galicia;Pontevedra;Meaño;5465
Galicia;Pontevedra;Meis;5002
Galicia;Pontevedra;Moaña;19014
Galicia;Pontevedra;Mondariz;5259
Galicia;Pontevedra;Mondariz-Balneario;726
Galicia;Pontevedra;Moraña;4411
Galicia;Pontevedra;Mos;14650
Galicia;Pontevedra;Neves (As);4466
Galicia;Pontevedra;Nigrán;18021
Galicia;Pontevedra;Oia;3227
Galicia;Pontevedra;Pazos de Borbén;3170
Galicia;Pontevedra;Poio;16043
Galicia;Pontevedra;Ponte Caldelas;6422
Galicia;Pontevedra;Ponteareas;23172
Galicia;Pontevedra;Pontecesures;3145
Galicia;Pontevedra;Pontevedra;81576
Galicia;Pontevedra;Porriño (O);17475
Galicia;Pontevedra;Portas;3089
Galicia;Pontevedra;Redondela;30001
Galicia;Pontevedra;Ribadumia;4874
Galicia;Pontevedra;Rodeiro;3143
Galicia;Pontevedra;Rosal (O);6570
Galicia;Pontevedra;Salceda de Caselas;8289
Galicia;Pontevedra;Salvaterra de Miño;9293
Galicia;Pontevedra;Sanxenxo;17315
Galicia;Pontevedra;Silleda;9248
Galicia;Pontevedra;Soutomaior;6867
Galicia;Pontevedra;Tomiño;13315
Galicia;Pontevedra;Tui;17262
Galicia;Pontevedra;Valga;6120
Galicia;Pontevedra;Vigo;297332
Galicia;Pontevedra;Vila de Cruces;6475
Galicia;Pontevedra;Vilaboa;5978
Galicia;Pontevedra;Vilagarcía de Arousa;37576
Galicia;Pontevedra;Vilanova de Arousa;10719
Islas Baleares;Illes Balears;Alaior;9257
Islas Baleares;Illes Balears;Alaró;5327
Islas Baleares;Illes Balears;Alcúdia;19071
Islas Baleares;Illes Balears;Algaida;5050
Islas Baleares;Illes Balears;Andratx;11685
Islas Baleares;Illes Balears;Ariany;872
Islas Baleares;Illes Balears;Artà;7411
Islas Baleares;Illes Balears;Banyalbufar;605
Islas Baleares;Illes Balears;Binissalem;7251
Islas Baleares;Illes Balears;Búger;1060
Islas Baleares;Illes Balears;Bunyola;6026
Islas Baleares;Illes Balears;Calvià;51774
Islas Baleares;Illes Balears;Campanet;2602
Islas Baleares;Illes Balears;Campos;9601
Islas Baleares;Illes Balears;Capdepera;11911
Islas Baleares;Illes Balears;Castell (Es);7892
Islas Baleares;Illes Balears;Ciutadella de Menorca;29160
Islas Baleares;Illes Balears;Consell;3515
Islas Baleares;Illes Balears;Costitx;1078
Islas Baleares;Illes Balears;Deyá;755
Islas Baleares;Illes Balears;Eivissa;48684
Islas Baleares;Illes Balears;Escorca;280
Islas Baleares;Illes Balears;Esporles;4808
Islas Baleares;Illes Balears;Estellencs;389
Islas Baleares;Illes Balears;Felanitx;18270
Islas Baleares;Illes Balears;Ferreries;4669
Islas Baleares;Illes Balears;Formentera;9552
Islas Baleares;Illes Balears;Fornalutx;758
Islas Baleares;Illes Balears;Inca;29308
Islas Baleares;Illes Balears;Lloret de Vistalegre;1275
Islas Baleares;Illes Balears;Lloseta;5704
Islas Baleares;Illes Balears;Llubí;2265
Islas Baleares;Illes Balears;Llucmajor;36078
Islas Baleares;Illes Balears;Manacor;40548
Islas Baleares;Illes Balears;Mancor de la Vall;1199
Islas Baleares;Illes Balears;Maó;29125
Islas Baleares;Illes Balears;Maria de la Salut;2150
Islas Baleares;Illes Balears;Marratxí;33348
Islas Baleares;Illes Balears;Mercadal (Es);5292
Islas Baleares;Illes Balears;Migjorn Gran (Es);1523
Islas Baleares;Illes Balears;Montuïri;2827
Islas Baleares;Illes Balears;Muro;7144
Islas Baleares;Illes Balears;Palma;401270
Islas Baleares;Illes Balears;Petra;2886
Islas Baleares;Illes Balears;Pobla (Sa);12766
Islas Baleares;Illes Balears;Pollença;17260
Islas Baleares;Illes Balears;Porreres;5428
Islas Baleares;Illes Balears;Puigpunyent;1867
Islas Baleares;Illes Balears;Salines (Ses);5270
Islas Baleares;Illes Balears;Sant Antoni de Portmany;21852
Islas Baleares;Illes Balears;Sant Joan;1962
Islas Baleares;Illes Balears;Sant Joan de Labritja;5541
Islas Baleares;Illes Balears;Sant Josep de sa Talaia;22171
Islas Baleares;Illes Balears;Sant Llorenç des Cardassar;8687
Islas Baleares;Illes Balears;Sant Lluís;6997
Islas Baleares;Illes Balears;Santa Eugènia;1663
Islas Baleares;Illes Balears;Santa Eulalia del Río;31314
Islas Baleares;Illes Balears;Santa Margalida;11537
Islas Baleares;Illes Balears;Santa María del Camí;5992
Islas Baleares;Illes Balears;Santanyí;12664
Islas Baleares;Illes Balears;Selva;3515
Islas Baleares;Illes Balears;Sencelles;3105
Islas Baleares;Illes Balears;Sineu;3520
Islas Baleares;Illes Balears;Sóller;13942
Islas Baleares;Illes Balears;Son Servera;12215
Islas Baleares;Illes Balears;Valldemossa;1995
Islas Baleares;Illes Balears;Vilafranca de Bonany;2908
La Rioja;La Rioja;Ábalos;387
La Rioja;La Rioja;Agoncillo;1191
La Rioja;La Rioja;Aguilar del Río Alhama;573
La Rioja;La Rioja;Ajamil de Cameros;62
La Rioja;La Rioja;Albelda de Iregua;3075
La Rioja;La Rioja;Alberite;2668
La Rioja;La Rioja;Alcanadre;754
La Rioja;La Rioja;Aldeanueva de Ebro;2812
La Rioja;La Rioja;Alesanco;482
La Rioja;La Rioja;Alesón;132
La Rioja;La Rioja;Alfaro;9883
La Rioja;La Rioja;Almarza de Cameros;27
La Rioja;La Rioja;Anguciana;523
La Rioja;La Rioja;Anguiano;542
La Rioja;La Rioja;Arenzana de Abajo;291
La Rioja;La Rioja;Arenzana de Arriba;43
La Rioja;La Rioja;Arnedillo;472
La Rioja;La Rioja;Arnedo;14457
La Rioja;La Rioja;Arrúbal;475
La Rioja;La Rioja;Ausejo;966
La Rioja;La Rioja;Autol;4359
La Rioja;La Rioja;Azofra;266
La Rioja;La Rioja;Badarán;615
La Rioja;La Rioja;Bañares;324
La Rioja;La Rioja;Baños de Río Tobía;1728
La Rioja;La Rioja;Baños de Rioja;93
La Rioja;La Rioja;Berceo;190
La Rioja;La Rioja;Bergasa;164
La Rioja;La Rioja;Bergasillas Bajera;34
La Rioja;La Rioja;Bezares;20
La Rioja;La Rioja;Bobadilla;140
La Rioja;La Rioja;Brieva de Cameros;59
La Rioja;La Rioja;Briñas;260
La Rioja;La Rioja;Briones;911
La Rioja;La Rioja;Cabezón de Cameros;22
La Rioja;La Rioja;Calahorra;24787
La Rioja;La Rioja;Camprovín;189
La Rioja;La Rioja;Canales de la Sierra;80
La Rioja;La Rioja;Cañas;95
La Rioja;La Rioja;Canillas de Río Tuerto;46
La Rioja;La Rioja;Cárdenas;182
La Rioja;La Rioja;Casalarreina;1366
La Rioja;La Rioja;Castañares de Rioja;392
La Rioja;La Rioja;Castroviejo;64
La Rioja;La Rioja;Cellorigo;15
La Rioja;La Rioja;Cenicero;2187
La Rioja;La Rioja;Cervera del Río Alhama;2923
La Rioja;La Rioja;Cidamón;36
La Rioja;La Rioja;Cihuri;218
La Rioja;La Rioja;Cirueña;132
La Rioja;La Rioja;Clavijo;276
La Rioja;La Rioja;Cordovín;191
La Rioja;La Rioja;Corera;277
La Rioja;La Rioja;Cornago;463
La Rioja;La Rioja;Corporales;35
La Rioja;La Rioja;Cuzcurrita de Río Tirón;551
La Rioja;La Rioja;Daroca de Rioja;44
La Rioja;La Rioja;Enciso;159
La Rioja;La Rioja;Entrena;1487
La Rioja;La Rioja;Estollo;102
La Rioja;La Rioja;Ezcaray;2077
La Rioja;La Rioja;Foncea;96
La Rioja;La Rioja;Fonzaleche;162
La Rioja;La Rioja;Fuenmayor;3238
La Rioja;La Rioja;Galbárruli;64
La Rioja;La Rioja;Galilea;389
La Rioja;La Rioja;Gallinero de Cameros;25
La Rioja;La Rioja;Gimileo;167
La Rioja;La Rioja;Grañón;323
La Rioja;La Rioja;Grávalos;248
La Rioja;La Rioja;Haro;12261
La Rioja;La Rioja;Herce;384
La Rioja;La Rioja;Herramélluri;94
La Rioja;La Rioja;Hervías;160
La Rioja;La Rioja;Hormilla;453
La Rioja;La Rioja;Hormilleja;173
La Rioja;La Rioja;Hornillos de Cameros;13
La Rioja;La Rioja;Hornos de Moncalvillo;95
La Rioja;La Rioja;Huércanos;903
La Rioja;La Rioja;Igea;706
La Rioja;La Rioja;Jalón de Cameros;26
La Rioja;La Rioja;Laguna de Cameros;143
La Rioja;La Rioja;Lagunilla del Jubera;334
La Rioja;La Rioja;Lardero;7968
La Rioja;La Rioja;Ledesma de la Cogolla;25
La Rioja;La Rioja;Leiva;290
La Rioja;La Rioja;Leza de Río Leza;52
La Rioja;La Rioja;Logroño;152107
La Rioja;La Rioja;Lumbreras;164
La Rioja;La Rioja;Manjarrés;148
La Rioja;La Rioja;Mansilla de la Sierra;69
La Rioja;La Rioja;Manzanares de Rioja;100
La Rioja;La Rioja;Matute;151
La Rioja;La Rioja;Medrano;283
La Rioja;La Rioja;Munilla;123
La Rioja;La Rioja;Murillo de Río Leza;1781
La Rioja;La Rioja;Muro de Aguas;60
La Rioja;La Rioja;Muro en Cameros;39
La Rioja;La Rioja;Nájera;8474
La Rioja;La Rioja;Nalda;1071
La Rioja;La Rioja;Navajún;18
La Rioja;La Rioja;Navarrete;2830
La Rioja;La Rioja;Nestares;79
La Rioja;La Rioja;Nieva de Cameros;104
La Rioja;La Rioja;Ochánduri;76
La Rioja;La Rioja;Ocón;352
La Rioja;La Rioja;Ojacastro;214
La Rioja;La Rioja;Ollauri;332
La Rioja;La Rioja;Ortigosa de Cameros;288
La Rioja;La Rioja;Pazuengos;38
La Rioja;La Rioja;Pedroso;99
La Rioja;La Rioja;Pinillos;16
La Rioja;La Rioja;Pradejón;3982
La Rioja;La Rioja;Pradillo;68
La Rioja;La Rioja;Préjano;228
La Rioja;La Rioja;Quel;2037
La Rioja;La Rioja;Rabanera;38
La Rioja;La Rioja;Rasillo de Cameros (El);141
La Rioja;La Rioja;Redal (El);169
La Rioja;La Rioja;Ribafrecha;993
La Rioja;La Rioja;Rincón de Soto;3805
La Rioja;La Rioja;Robres del Castillo;31
La Rioja;La Rioja;Rodezno;323
La Rioja;La Rioja;Sajazarra;136
La Rioja;La Rioja;San Asensio;1274
La Rioja;La Rioja;San Millán de la Cogolla;293
La Rioja;La Rioja;San Millán de Yécora;59
La Rioja;La Rioja;San Román de Cameros;166
La Rioja;La Rioja;San Torcuato;71
La Rioja;La Rioja;San Vicente de la Sonsierra;1150
La Rioja;La Rioja;Santa Coloma;143
La Rioja;La Rioja;Santa Engracia del Jubera;176
La Rioja;La Rioja;Santa Eulalia Bajera;131
La Rioja;La Rioja;Santo Domingo de la Calzada;6780
La Rioja;La Rioja;Santurde de Rioja;361
La Rioja;La Rioja;Santurdejo;164
La Rioja;La Rioja;Sojuela;201
La Rioja;La Rioja;Sorzano;267
La Rioja;La Rioja;Sotés;287
La Rioja;La Rioja;Soto en Cameros;152
La Rioja;La Rioja;Terroba;39
La Rioja;La Rioja;Tirgo;244
La Rioja;La Rioja;Tobía;79
La Rioja;La Rioja;Tormantos;161
La Rioja;La Rioja;Torre en Cameros;13
La Rioja;La Rioja;Torrecilla en Cameros;534
La Rioja;La Rioja;Torrecilla sobre Alesanco;48
La Rioja;La Rioja;Torremontalbo;17
La Rioja;La Rioja;Treviana;201
La Rioja;La Rioja;Tricio;424
La Rioja;La Rioja;Tudelilla;419
La Rioja;La Rioja;Uruñuela;924
La Rioja;La Rioja;Valdemadera;9
La Rioja;La Rioja;Valgañón;146
La Rioja;La Rioja;Ventosa;173
La Rioja;La Rioja;Ventrosa;58
La Rioja;La Rioja;Viguera;444
La Rioja;La Rioja;Villalba de Rioja;157
La Rioja;La Rioja;Villalobar de Rioja;64
La Rioja;La Rioja;Villamediana de Iregua;6414
La Rioja;La Rioja;Villanueva de Cameros;101
La Rioja;La Rioja;Villar de Arnedo (El);661
La Rioja;La Rioja;Villar de Torre;277
La Rioja;La Rioja;Villarejo;38
La Rioja;La Rioja;Villarroya;10
La Rioja;La Rioja;Villarta-Quintana;148
La Rioja;La Rioja;Villavelayo;71
La Rioja;La Rioja;Villaverde de Rioja;78
La Rioja;La Rioja;Villoslada de Cameros;367
La Rioja;La Rioja;Viniegra de Abajo;104
La Rioja;La Rioja;Viniegra de Arriba;46
La Rioja;La Rioja;Zarratón;328
La Rioja;La Rioja;Zarzosa;14
La Rioja;La Rioja;Zorraquín;83
Madrid;Madrid;Acebeda (La);61
Madrid;Madrid;Ajalvir;3780
Madrid;Madrid;Alameda del Valle;237
Madrid;Madrid;Álamo (El);7857
Madrid;Madrid;Alcalá de Henares;204574
Madrid;Madrid;Alcobendas;109104
Madrid;Madrid;Alcorcón;167967
Madrid;Madrid;Aldea del Fresno;2457
Madrid;Madrid;Algete;20204
Madrid;Madrid;Alpedrete;12797
Madrid;Madrid;Ambite;557
Madrid;Madrid;Anchuelo;1005
Madrid;Madrid;Aranjuez;54055
Madrid;Madrid;Arganda del Rey;51489
Madrid;Madrid;Arroyomolinos;13835
Madrid;Madrid;Atazar (El);109
Madrid;Madrid;Batres;1466
Madrid;Madrid;Becerril de la Sierra;5083
Madrid;Madrid;Belmonte de Tajo;1451
Madrid;Madrid;Berrueco (El);585
Madrid;Madrid;Berzosa del Lozoya;226
Madrid;Madrid;Boadilla del Monte;43414
Madrid;Madrid;Boalo (El);6413
Madrid;Madrid;Braojos;190
Madrid;Madrid;Brea de Tajo;515
Madrid;Madrid;Brunete;9522
Madrid;Madrid;Buitrago del Lozoya;2078
Madrid;Madrid;Bustarviejo;2062
Madrid;Madrid;Cabanillas de la Sierra;745
Madrid;Madrid;Cabrera (La);2493
Madrid;Madrid;Cadalso de los Vidrios;2903
Madrid;Madrid;Camarma de Esteruelas;6445
Madrid;Madrid;Campo Real;5087
Madrid;Madrid;Canencia;523
Madrid;Madrid;Carabaña;1910
Madrid;Madrid;Casarrubuelos;3062
Madrid;Madrid;Cenicientos;2087
Madrid;Madrid;Cercedilla;7023
Madrid;Madrid;Cervera de Buitrago;156
Madrid;Madrid;Chapinería;2061
Madrid;Madrid;Chinchón;5308
Madrid;Madrid;Ciempozuelos;22132
Madrid;Madrid;Cobeña;5818
Madrid;Madrid;Collado Mediano;6473
Madrid;Madrid;Collado Villalba;55027
Madrid;Madrid;Colmenar de Oreja;8357
Madrid;Madrid;Colmenar del Arroyo;1376
Madrid;Madrid;Colmenar Viejo;43700
Madrid;Madrid;Colmenarejo;8232
Madrid;Madrid;Corpa;559
Madrid;Madrid;Coslada;90280
Madrid;Madrid;Cubas de la Sagra;4499
Madrid;Madrid;Daganzo de Arriba;8792
Madrid;Madrid;Escorial (El);14979
Madrid;Madrid;Estremera;1518
Madrid;Madrid;Fresnedillas de la Oliva;1396
Madrid;Madrid;Fresno de Torote;2074
Madrid;Madrid;Fuenlabrada;197836
Madrid;Madrid;Fuente el Saz de Jarama;6282
Madrid;Madrid;Fuentidueña de Tajo;2081
Madrid;Madrid;Galapagar;31820
Madrid;Madrid;Garganta de los Montes;397
Madrid;Madrid;Gargantilla del Lozoya y Pinilla de Buitrago;378
Madrid;Madrid;Gascones;152
Madrid;Madrid;Getafe;167164
Madrid;Madrid;Griñón;9387
Madrid;Madrid;Guadalix de la Sierra;5759
Madrid;Madrid;Guadarrama;14800
Madrid;Madrid;Hiruela (La);74
Madrid;Madrid;Horcajo de la Sierra;173
Madrid;Madrid;Horcajuelo de la Sierra;91
Madrid;Madrid;Hoyo de Manzanares;7580
Madrid;Madrid;Humanes de Madrid;18098
Madrid;Madrid;Leganés;186066
Madrid;Madrid;Loeches;6781
Madrid;Madrid;Lozoya;652
Madrid;Madrid;Lozoyuela-Navas-Sieteiglesias;1093
Madrid;Madrid;Madarcos;49
Madrid;Madrid;Madrid;3255944
Madrid;Madrid;Majadahonda;68110
Madrid;Madrid;Manzanares el Real;7244
Madrid;Madrid;Meco;12419
Madrid;Madrid;Mejorada del Campo;22488
Madrid;Madrid;Miraflores de la Sierra;5947
Madrid;Madrid;Molar (El);7392
Madrid;Madrid;Molinos (Los);4537
Madrid;Madrid;Montejo de la Sierra;354
Madrid;Madrid;Moraleja de Enmedio;4712
Madrid;Madrid;Moralzarzal;11582
Madrid;Madrid;Morata de Tajuña;7262
Madrid;Madrid;Móstoles;206478
Madrid;Madrid;Navacerrada;2710
Madrid;Madrid;Navalafuente;1140
Madrid;Madrid;Navalagamella;2306
Madrid;Madrid;Navalcarnero;21584
Madrid;Madrid;Navarredonda y San Mamés;142
Madrid;Madrid;Navas del Rey;2529
Madrid;Madrid;Nuevo Baztán;6168
Madrid;Madrid;Olmeda de las Fuentes;297
Madrid;Madrid;Orusco de Tajuña;1197
Madrid;Madrid;Paracuellos de Jarama;14329
Madrid;Madrid;Parla;115611
Madrid;Madrid;Patones;507
Madrid;Madrid;Pedrezuela;4224
Madrid;Madrid;Pelayos de la Presa;2537
Madrid;Madrid;Perales de Tajuña;2858
Madrid;Madrid;Pezuela de las Torres;826
Madrid;Madrid;Pinilla del Valle;196
Madrid;Madrid;Pinto;43501
Madrid;Madrid;Piñuécar-Gandullas;202
Madrid;Madrid;Pozuelo de Alarcón;82428
Madrid;Madrid;Pozuelo del Rey;801
Madrid;Madrid;Prádena del Rincón;122
Madrid;Madrid;Puebla de la Sierra;110
Madrid;Madrid;Puentes Viejas;623
Madrid;Madrid;Quijorna;2810
Madrid;Madrid;Rascafría;1998
Madrid;Madrid;Redueña;279
Madrid;Madrid;Ribatejada;625
Madrid;Madrid;Rivas-Vaciamadrid;68405
Madrid;Madrid;Robledillo de la Jara;136
Madrid;Madrid;Robledo de Chavela;3812
Madrid;Madrid;Robregordo;61
Madrid;Madrid;Rozas de Madrid (Las);86340
Madrid;Madrid;Rozas de Puerto Real;426
Madrid;Madrid;San Agustín del Guadalix;11133
Madrid;Madrid;San Fernando de Henares;40981
Madrid;Madrid;San Lorenzo de El Escorial;17889
Madrid;Madrid;San Martín de la Vega;18256
Madrid;Madrid;San Martín de Valdeiglesias;8048
Madrid;Madrid;San Sebastián de los Reyes;75912
Madrid;Madrid;Santa María de la Alameda;1184
Madrid;Madrid;Santorcaz;825
Madrid;Madrid;Santos de la Humosa (Los);2139
Madrid;Madrid;Serna del Monte (La);103
Madrid;Madrid;Serranillos del Valle;3417
Madrid;Madrid;Sevilla la Nueva;8234
Madrid;Madrid;Somosierra;111
Madrid;Madrid;Soto del Real;8294
Madrid;Madrid;Talamanca de Jarama;2689
Madrid;Madrid;Tielmes;2545
Madrid;Madrid;Titulcia;1162
Madrid;Madrid;Torrejón de Ardoz;118162
Madrid;Madrid;Torrejón de la Calzada;6701
Madrid;Madrid;Torrejón de Velasco;4049
Madrid;Madrid;Torrelaguna;4853
Madrid;Madrid;Torrelodones;21781
Madrid;Madrid;Torremocha de Jarama;769
Madrid;Madrid;Torres de la Alameda;7776
Madrid;Madrid;Tres Cantos;41064
Madrid;Madrid;Valdaracete;692
Madrid;Madrid;Valdeavero;1255
Madrid;Madrid;Valdelaguna;872
Madrid;Madrid;Valdemanco;975
Madrid;Madrid;Valdemaqueda;858
Madrid;Madrid;Valdemorillo;11045
Madrid;Madrid;Valdemoro;62750
Madrid;Madrid;Valdeolmos-Alalpardo;3035
Madrid;Madrid;Valdepiélagos;449
Madrid;Madrid;Valdetorres de Jarama;3847
Madrid;Madrid;Valdilecha;2794
Madrid;Madrid;Valverde de Alcalá;465
Madrid;Madrid;Velilla de San Antonio;11553
Madrid;Madrid;Vellón (El);1680
Madrid;Madrid;Venturada;1682
Madrid;Madrid;Villa del Prado;6368
Madrid;Madrid;Villaconejos;3389
Madrid;Madrid;Villalbilla;8923
Madrid;Madrid;Villamanrique de Tajo;786
Madrid;Madrid;Villamanta;2441
Madrid;Madrid;Villamantilla;858
Madrid;Madrid;Villanueva de la Cañada;16804
Madrid;Madrid;Villanueva de Perales;1326
Madrid;Madrid;Villanueva del Pardillo;15087
Madrid;Madrid;Villar del Olmo;2119
Madrid;Madrid;Villarejo de Salvanés;7451
Madrid;Madrid;Villaviciosa de Odón;26475
Madrid;Madrid;Villavieja del Lozoya;258
Madrid;Madrid;Zarzalejo;1488
Murcia;Murcia;Abanilla;6589
Murcia;Murcia;Abarán;12991
Murcia;Murcia;Águilas;34533
Murcia;Murcia;Albudeite;1369
Murcia;Murcia;Alcantarilla;41084
Murcia;Murcia;Alcázares (Los);15619
Murcia;Murcia;Aledo;1066
Murcia;Murcia;Alguazas;8978
Murcia;Murcia;Alhama de Murcia;19860
Murcia;Murcia;Archena;18202
Murcia;Murcia;Beniel;10933
Murcia;Murcia;Blanca;6370
Murcia;Murcia;Bullas;12493
Murcia;Murcia;Calasparra;10759
Murcia;Murcia;Campos del Río;2210
Murcia;Murcia;Caravaca de la Cruz;26415
Murcia;Murcia;Cartagena;211996
Murcia;Murcia;Cehegín;16235
Murcia;Murcia;Ceutí;10174
Murcia;Murcia;Cieza;35200
Murcia;Murcia;Fortuna;9583
Murcia;Murcia;Fuente Álamo de Murcia;14876
Murcia;Murcia;Jumilla;25685
Murcia;Murcia;Librilla;4534
Murcia;Murcia;Lorca;91906
Murcia;Murcia;Lorquí;6996
Murcia;Murcia;Mazarrón;35221
Murcia;Murcia;Molina de Segura;64065
Murcia;Murcia;Moratalla;8455
Murcia;Murcia;Mula;16941
Murcia;Murcia;Murcia;436870
Murcia;Murcia;Ojós;584
Murcia;Murcia;Pliego;4034
Murcia;Murcia;Puerto Lumbreras;13947
Murcia;Murcia;Ricote;1519
Murcia;Murcia;San Javier;31432
Murcia;Murcia;San Pedro del Pinatar;23738
Murcia;Murcia;Santomera;15319
Murcia;Murcia;Torre-Pacheco;31495
Murcia;Murcia;Torres de Cotillas (Las);21062
Murcia;Murcia;Totana;29211
Murcia;Murcia;Ulea;939
Murcia;Murcia;Unión (La);17737
Murcia;Murcia;Villanueva del Río Segura;2270
Murcia;Murcia;Yecla;35025
Navarra;Navarra;Abáigar;102
Navarra;Navarra;Abárzuza;574
Navarra;Navarra;Abaurregaina/Abaurrea Alta;140
Navarra;Navarra;Abaurrepea/Abaurrea Baja;41
Navarra;Navarra;Aberin;368
Navarra;Navarra;Ablitas;2599
Navarra;Navarra;Adiós;185
Navarra;Navarra;Aguilar de Codés;108
Navarra;Navarra;Aibar/Oibar;911
Navarra;Navarra;Allín;814
Navarra;Navarra;Allo;1078
Navarra;Navarra;Altsasu/Alsasua;7623
Navarra;Navarra;Améscoa Baja;811
Navarra;Navarra;Ancín;383
Navarra;Navarra;Andosilla;2996
Navarra;Navarra;Añorbe;537
Navarra;Navarra;Ansoáin;10500
Navarra;Navarra;Anue;369
Navarra;Navarra;Aoiz/Agoitz;2464
Navarra;Navarra;Araitz;582
Navarra;Navarra;Arakil;952
Navarra;Navarra;Aranarache;85
Navarra;Navarra;Aranguren;7139
Navarra;Navarra;Arano;134
Navarra;Navarra;Arantza;641
Navarra;Navarra;Aras;199
Navarra;Navarra;Arbizu;1060
Navarra;Navarra;Arce/Artzi;254
Navarra;Navarra;Arcos (Los);1277
Navarra;Navarra;Arellano;194
Navarra;Navarra;Areso;277
Navarra;Navarra;Arguedas;2420
Navarra;Navarra;Aria;59
Navarra;Navarra;Aribe;50
Navarra;Navarra;Armañanzas;63
Navarra;Navarra;Arróniz;1135
Navarra;Navarra;Arruazu;119
Navarra;Navarra;Artajona;1746
Navarra;Navarra;Artazu;121
Navarra;Navarra;Atez;245
Navarra;Navarra;Auritz/Burguete;293
Navarra;Navarra;Ayegui;1667
Navarra;Navarra;Azagra;3664
Navarra;Navarra;Azuelo;41
Navarra;Navarra;Bakaiku;338
Navarra;Navarra;Barañain;22110
Navarra;Navarra;Barásoain;631
Navarra;Navarra;Barbarin;74
Navarra;Navarra;Bargota;327
Navarra;Navarra;Barillas;195
Navarra;Navarra;Basaburua;851
Navarra;Navarra;Baztan;8127
Navarra;Navarra;Beintza-Labaien;253
Navarra;Navarra;Beire;342
Navarra;Navarra;Belascoáin;124
Navarra;Navarra;Bera/Vera de Bidasoa;3691
Navarra;Navarra;Berbinzana;687
Navarra;Navarra;Beriáin;3651
Navarra;Navarra;Berrioplano;4344
Navarra;Navarra;Berriozar;9020
Navarra;Navarra;Bertizarana;645
Navarra;Navarra;Betelu;347
Navarra;Navarra;Bidaurreta;144
Navarra;Navarra;Biurrun-Olcoz;202
Navarra;Navarra;Buñuel;2404
Navarra;Navarra;Burgui/Burgi;235
Navarra;Navarra;Burlada/Burlata;18595
Navarra;Navarra;Busto (El);81
Navarra;Navarra;Cabanillas;1483
Navarra;Navarra;Cabredo;103
Navarra;Navarra;Cadreita;2052
Navarra;Navarra;Caparroso;2717
Navarra;Navarra;Cárcar;1176
Navarra;Navarra;Carcastillo;2617
Navarra;Navarra;Cascante;4034
Navarra;Navarra;Cáseda;1039
Navarra;Navarra;Castejón;4235
Navarra;Navarra;Castillonuevo;18
Navarra;Navarra;Cendea de Olza/Oltza Zendea;1576
Navarra;Navarra;Cintruénigo;7636
Navarra;Navarra;Cirauqui;475
Navarra;Navarra;Ciriza;110
Navarra;Navarra;Cizur;3110
Navarra;Navarra;Corella;8031
Navarra;Navarra;Cortes;3404
Navarra;Navarra;Desojo;102
Navarra;Navarra;Dicastillo;710
Navarra;Navarra;Donamaria;433
Navarra;Navarra;Doneztebe/Santesteban;1647
Navarra;Navarra;Echarri;67
Navarra;Navarra;Egüés;10787
Navarra;Navarra;Elgorriaga;224
Navarra;Navarra;Enériz;318
Navarra;Navarra;Eratsun;165
Navarra;Navarra;Ergoiena;426
Navarra;Navarra;Erro;777
Navarra;Navarra;Eslava;138
Navarra;Navarra;Esparza de Salazar/Espartza Zaraitzu;99
Navarra;Navarra;Espronceda;134
Navarra;Navarra;Estella/Lizarra;14238
Navarra;Navarra;Esteribar;2105
Navarra;Navarra;Etayo;84
Navarra;Navarra;Etxalar;823
Navarra;Navarra;Etxarri-Aranatz;2460
Navarra;Navarra;Etxauri;583
Navarra;Navarra;Eulate;343
Navarra;Navarra;Ezcabarte;1661
Navarra;Navarra;Ezcároz/Ezkaroze;347
Navarra;Navarra;Ezkurra;169
Navarra;Navarra;Ezprogui;54
Navarra;Navarra;Falces;2641
Navarra;Navarra;Fitero;2222
Navarra;Navarra;Fontellas;910
Navarra;Navarra;Funes;2379
Navarra;Navarra;Fustiñana;2624
Navarra;Navarra;Galar;1628
Navarra;Navarra;Gallipienzo;126
Navarra;Navarra;Gallués/Galoze;99
Navarra;Navarra;Garaioa;112
Navarra;Navarra;Garde;176
Navarra;Navarra;Garínoain;511
Navarra;Navarra;Garralda;203
Navarra;Navarra;Genevilla;98
Navarra;Navarra;Goizueta;780
Navarra;Navarra;Goñi;173
Navarra;Navarra;Güesa/Gorza;54
Navarra;Navarra;Guesálaz;457
Navarra;Navarra;Guirguillano;87
Navarra;Navarra;Hiriberri/Villanueva de Aezkoa;127
Navarra;Navarra;Huarte/Uharte;5858
Navarra;Navarra;Ibargoiti;249
Navarra;Navarra;Igantzi;629
Navarra;Navarra;Igúzquiza;345
Navarra;Navarra;Imotz;446
Navarra;Navarra;Irañeta;161
Navarra;Navarra;Irurtzun;2225
Navarra;Navarra;Isaba/Izaba;491
Navarra;Navarra;Ituren;497
Navarra;Navarra;Iturmendi;401
Navarra;Navarra;Iza;982
Navarra;Navarra;Izagaondoa;180
Navarra;Navarra;Izalzu/Itzaltzu;46
Navarra;Navarra;Jaurrieta;216
Navarra;Navarra;Javier;113
Navarra;Navarra;Juslapeña;569
Navarra;Navarra;Lakuntza;1205
Navarra;Navarra;Lana;196
Navarra;Navarra;Lantz;113
Navarra;Navarra;Lapoblación;151
Navarra;Navarra;Larraga;2121
Navarra;Navarra;Larraona;112
Navarra;Navarra;Larraun;1023
Navarra;Navarra;Lazagurría;202
Navarra;Navarra;Leache;55
Navarra;Navarra;Legarda;106
Navarra;Navarra;Legaria;116
Navarra;Navarra;Leitza;2920
Navarra;Navarra;Lekunberri;1386
Navarra;Navarra;Leoz;272
Navarra;Navarra;Lerga;84
Navarra;Navarra;Lerín;1905
Navarra;Navarra;Lesaka;2808
Navarra;Navarra;Lezáun;266
Navarra;Navarra;Liédena;335
Navarra;Navarra;Lizoáin;308
Navarra;Navarra;Lodosa;4939
Navarra;Navarra;Lónguida/Longida;315
Navarra;Navarra;Lumbier;1397
Navarra;Navarra;Luquin;146
Navarra;Navarra;Luzaide/Valcarlos;418
Navarra;Navarra;Mañeru;389
Navarra;Navarra;Marañón;56
Navarra;Navarra;Marcilla;2834
Navarra;Navarra;Mélida;780
Navarra;Navarra;Mendavia;3814
Navarra;Navarra;Mendaza;308
Navarra;Navarra;Mendigorría;1062
Navarra;Navarra;Metauten;283
Navarra;Navarra;Milagro;3394
Navarra;Navarra;Mirafuentes;45
Navarra;Navarra;Miranda de Arga;957
Navarra;Navarra;Monreal;468
Navarra;Navarra;Monteagudo;1168
Navarra;Navarra;Morentin;138
Navarra;Navarra;Mues;98
Navarra;Navarra;Murchante;3672
Navarra;Navarra;Murieta;364
Navarra;Navarra;Murillo el Cuende;648
Navarra;Navarra;Murillo el Fruto;730
Navarra;Navarra;Muruzábal;284
Navarra;Navarra;Navascués;191
Navarra;Navarra;Nazar;49
Navarra;Navarra;Noáin (Valle de Elorz)/Noain (Elortzibar);6806
Navarra;Navarra;Obanos;979
Navarra;Navarra;Ochagavía/Otsagabia;614
Navarra;Navarra;Oco;71
Navarra;Navarra;Odieta;338
Navarra;Navarra;Oitz;149
Navarra;Navarra;Olaibar;224
Navarra;Navarra;Olazti/Olazagutía;1737
Navarra;Navarra;Olejua;53
Navarra;Navarra;Olite;3650
Navarra;Navarra;Ollo;275
Navarra;Navarra;Olóriz;174
Navarra;Navarra;Orbaitzeta;219
Navarra;Navarra;Orbara;44
Navarra;Navarra;Orísoain;82
Navarra;Navarra;Orkoien;3320
Navarra;Navarra;Oronz/Orontze;47
Navarra;Navarra;Oroz-Betelu;171
Navarra;Navarra;Orreaga/Roncesvalles;30
Navarra;Navarra;Oteiza;969
Navarra;Navarra;Pamplona/Iruña;198491
Navarra;Navarra;Peralta;6056
Navarra;Navarra;Petilla de Aragón;25
Navarra;Navarra;Piedramillera;55
Navarra;Navarra;Pitillas;556
Navarra;Navarra;Puente la Reina/Gares;2841
Navarra;Navarra;Pueyo;318
Navarra;Navarra;Ribaforada;3638
Navarra;Navarra;Romanzado;153
Navarra;Navarra;Roncal/Erronkari;258
Navarra;Navarra;Sada;185
Navarra;Navarra;Saldías;119
Navarra;Navarra;Salinas de Oro;115
Navarra;Navarra;San Adrián;6201
Navarra;Navarra;San Martín de Unx;460
Navarra;Navarra;Sangüesa/Zangoza;5210
Navarra;Navarra;Sansol;106
Navarra;Navarra;Santacara;956
Navarra;Navarra;Sarriés/Sartze;65
Navarra;Navarra;Sartaguda;1407
Navarra;Navarra;Sesma;1286
Navarra;Navarra;Sorlada;62
Navarra;Navarra;Sunbilla;659
Navarra;Navarra;Tafalla;11394
Navarra;Navarra;Tiebas-Muruarte de Reta;629
Navarra;Navarra;Tirapu;57
Navarra;Navarra;Torralba del Río;134
Navarra;Navarra;Torres del Río;154
Navarra;Navarra;Tudela;34717
Navarra;Navarra;Tulebras;129
Navarra;Navarra;Ucar;144
Navarra;Navarra;Uharte-Arakil;841
Navarra;Navarra;Ujué;222
Navarra;Navarra;Ultzama;1663
Navarra;Navarra;Unciti;218
Navarra;Navarra;Unzué;134
Navarra;Navarra;Urdazubi/Urdax;368
Navarra;Navarra;Urdiain;704
Navarra;Navarra;Urraul Alto;159
Navarra;Navarra;Urraul Bajo;273
Navarra;Navarra;Urrotz;191
Navarra;Navarra;Urroz-Villa;394
Navarra;Navarra;Urzainqui/Urzainki;91
Navarra;Navarra;Uterga;194
Navarra;Navarra;Uztárroz/Uztarroze;192
Navarra;Navarra;Valle de Yerri/Deierri;1548
Navarra;Navarra;Valtierra;2569
Navarra;Navarra;Viana;3812
Navarra;Navarra;Vidángoz/Bidankoze;107
Navarra;Navarra;Villafranca;3020
Navarra;Navarra;Villamayor de Monjardín;140
Navarra;Navarra;Villatuerta;1069
Navarra;Navarra;Villava/Atarrabia;10642
Navarra;Navarra;Yesa;254
Navarra;Navarra;Zabalza;242
Navarra;Navarra;Ziordia;400
Navarra;Navarra;Zizur Mayor/Zizur Nagusia;13345
Navarra;Navarra;Zubieta;315
Navarra;Navarra;Zugarramurdi;218
Navarra;Navarra;Zúñiga;127
País Vasco;Álava;Alegría-Dulantzi;2620
País Vasco;Álava;Amurrio;10089
País Vasco;Álava;Añana;176
País Vasco;Álava;Aramaio;1499
País Vasco;Álava;Armiñón;207
País Vasco;Álava;Arraia-Maeztu;710
País Vasco;Álava;Arrazua-Ubarrundia;921
País Vasco;Álava;Artziniega;1818
País Vasco;Álava;Asparrena;1644
País Vasco;Álava;Ayala/Aiara;2763
País Vasco;Álava;Baños de Ebro/Mañueta;333
País Vasco;Álava;Barrundia;875
País Vasco;Álava;Berantevilla;438
País Vasco;Álava;Bernedo;575
País Vasco;Álava;Campezo/Kanpezu;1118
País Vasco;Álava;Elburgo/Burgelu;541
País Vasco;Álava;Elciego;1046
País Vasco;Álava;Elvillar/Bilar;369
País Vasco;Álava;Erriberagoitia/Ribera Alta;728
País Vasco;Álava;Harana/Valle de Arana;305
País Vasco;Álava;Iruña Oka/Iruña de Oca;2887
País Vasco;Álava;Iruraiz-Gauna;493
País Vasco;Álava;Kripan;194
País Vasco;Álava;Kuartango;357
País Vasco;Álava;Labastida/Bastida;1494
País Vasco;Álava;Lagrán;186
País Vasco;Álava;Laguardia;1510
País Vasco;Álava;Lanciego/Lantziego;677
País Vasco;Álava;Lantarón;982
País Vasco;Álava;Lapuebla de Labarca;877
País Vasco;Álava;Laudio/Llodio;18314
País Vasco;Álava;Legutiano;1643
País Vasco;Álava;Leza;225
País Vasco;Álava;Moreda de Álava;261
País Vasco;Álava;Navaridas;209
País Vasco;Álava;Okondo;1087
País Vasco;Álava;Oyón-Oion;3150
País Vasco;Álava;Peñacerrada-Urizaharra;290
País Vasco;Álava;Ribera Baja/Erribera Beitia;1198
País Vasco;Álava;Salvatierra/Agurain;4801
País Vasco;Álava;Samaniego;319
País Vasco;Álava;San Millán/Donemiliaga;711
País Vasco;Álava;Urkabustaiz;1196
País Vasco;Álava;Valdegovía/Gaubea;1098
País Vasco;Álava;Villabuena de Álava/Eskuernaga;318
País Vasco;Álava;Vitoria-Gasteiz;235661
País Vasco;Álava;Yécora/Iekora;305
País Vasco;Álava;Zalduondo;185
País Vasco;Álava;Zambrana;377
País Vasco;Álava;Zigoitia;1649
País Vasco;Álava;Zuia;2390
País Vasco;Guipúzcoa;Abaltzisketa;316
País Vasco;Guipúzcoa;Aduna;401
País Vasco;Guipúzcoa;Aia;1958
País Vasco;Guipúzcoa;Aizarnazabal;669
País Vasco;Guipúzcoa;Albiztur;312
País Vasco;Guipúzcoa;Alegia;1733
País Vasco;Guipúzcoa;Alkiza;357
País Vasco;Guipúzcoa;Altzaga;161
País Vasco;Guipúzcoa;Altzo;402
País Vasco;Guipúzcoa;Amezketa;990
País Vasco;Guipúzcoa;Andoain;14679
País Vasco;Guipúzcoa;Anoeta;1851
País Vasco;Guipúzcoa;Antzuola;2168
País Vasco;Guipúzcoa;Arama;199
País Vasco;Guipúzcoa;Aretxabaleta;6689
País Vasco;Guipúzcoa;Arrasate/Mondragón;22064
País Vasco;Guipúzcoa;Asteasu;1478
País Vasco;Guipúzcoa;Astigarraga;4678
País Vasco;Guipúzcoa;Ataun;1671
País Vasco;Guipúzcoa;Azkoitia;11266
País Vasco;Guipúzcoa;Azpeitia;14375
País Vasco;Guipúzcoa;Baliarrain;110
País Vasco;Guipúzcoa;Beasain;13557
País Vasco;Guipúzcoa;Beizama;180
País Vasco;Guipúzcoa;Belauntza;292
País Vasco;Guipúzcoa;Berastegi;1033
País Vasco;Guipúzcoa;Bergara;14707
País Vasco;Guipúzcoa;Berrobi;600
País Vasco;Guipúzcoa;Bidegoian;510
País Vasco;Guipúzcoa;Deba;5408
País Vasco;Guipúzcoa;Donostia-San Sebastián;185357
País Vasco;Guipúzcoa;Eibar;27419
País Vasco;Guipúzcoa;Elduain;238
País Vasco;Guipúzcoa;Elgeta;1069
País Vasco;Guipúzcoa;Elgoibar;11220
País Vasco;Guipúzcoa;Errenteria;38767
País Vasco;Guipúzcoa;Errezil;628
País Vasco;Guipúzcoa;Eskoriatza;4063
País Vasco;Guipúzcoa;Ezkio-Itsaso;589
País Vasco;Guipúzcoa;Gabiria;474
País Vasco;Guipúzcoa;Gaintza;132
País Vasco;Guipúzcoa;Gaztelu;158
País Vasco;Guipúzcoa;Getaria;2628
País Vasco;Guipúzcoa;Hernani;19289
País Vasco;Guipúzcoa;Hernialde;346
País Vasco;Guipúzcoa;Hondarribia;16458
País Vasco;Guipúzcoa;Ibarra;4335
País Vasco;Guipúzcoa;Idiazabal;2264
País Vasco;Guipúzcoa;Ikaztegieta;465
País Vasco;Guipúzcoa;Irun;60951
País Vasco;Guipúzcoa;Irura;1515
País Vasco;Guipúzcoa;Itsasondo;649
País Vasco;Guipúzcoa;Larraul;249
País Vasco;Guipúzcoa;Lasarte-Oria;17782
País Vasco;Guipúzcoa;Lazkao;5354
País Vasco;Guipúzcoa;Leaburu;386
País Vasco;Guipúzcoa;Legazpi;8715
País Vasco;Guipúzcoa;Legorreta;1494
País Vasco;Guipúzcoa;Leintz-Gatzaga;266
País Vasco;Guipúzcoa;Lezo;6003
País Vasco;Guipúzcoa;Lizartza;641
País Vasco;Guipúzcoa;Mendaro;1907
País Vasco;Guipúzcoa;Mutiloa;235
País Vasco;Guipúzcoa;Mutriku;4979
País Vasco;Guipúzcoa;Oiartzun;9894
País Vasco;Guipúzcoa;Olaberria;968
País Vasco;Guipúzcoa;Oñati;10896
País Vasco;Guipúzcoa;Ordizia;9732
País Vasco;Guipúzcoa;Orendain;183
País Vasco;Guipúzcoa;Orexa;121
País Vasco;Guipúzcoa;Orio;5026
País Vasco;Guipúzcoa;Ormaiztegi;1323
País Vasco;Guipúzcoa;Pasaia;15990
País Vasco;Guipúzcoa;Segura;1391
País Vasco;Guipúzcoa;Soraluze/Placencia de las Armas;3990
País Vasco;Guipúzcoa;Tolosa;18044
País Vasco;Guipúzcoa;Urnieta;6135
País Vasco;Guipúzcoa;Urretxu;6912
País Vasco;Guipúzcoa;Usurbil;5919
País Vasco;Guipúzcoa;Villabona;5783
País Vasco;Guipúzcoa;Zaldibia;1525
País Vasco;Guipúzcoa;Zarautz;22627
País Vasco;Guipúzcoa;Zegama;1492
País Vasco;Guipúzcoa;Zerain;243
País Vasco;Guipúzcoa;Zestoa;3479
País Vasco;Guipúzcoa;Zizurkil;2797
País Vasco;Guipúzcoa;Zumaia;9285
País Vasco;Guipúzcoa;Zumarraga;10104
País Vasco;Vizcaya;Abadiño;7260
País Vasco;Vizcaya;Abanto y Ciérvana-Abanto Zierbena;9647
País Vasco;Vizcaya;Ajangiz;445
País Vasco;Vizcaya;Alonsotegi;2835
País Vasco;Vizcaya;Amorebieta-Etxano;17842
País Vasco;Vizcaya;Amoroto;408
País Vasco;Vizcaya;Arakaldo;95
País Vasco;Vizcaya;Arantzazu;305
País Vasco;Vizcaya;Areatza;1131
País Vasco;Vizcaya;Arrankudiaga;909
País Vasco;Vizcaya;Arratzu;375
País Vasco;Vizcaya;Arrieta;551
País Vasco;Vizcaya;Arrigorriaga;12435
País Vasco;Vizcaya;Artea;751
País Vasco;Vizcaya;Artzentales;712
País Vasco;Vizcaya;Atxondo;1454
País Vasco;Vizcaya;Aulesti;683
País Vasco;Vizcaya;Bakio;2313
País Vasco;Vizcaya;Balmaseda;7270
País Vasco;Vizcaya;Barakaldo;98460
País Vasco;Vizcaya;Barrika;1449
País Vasco;Vizcaya;Basauri;42657
País Vasco;Vizcaya;Bedia;962
País Vasco;Vizcaya;Berango;6588
País Vasco;Vizcaya;Bermeo;16937
País Vasco;Vizcaya;Berriatua;1309
País Vasco;Vizcaya;Berriz;4888
País Vasco;Vizcaya;Bilbao;354860
País Vasco;Vizcaya;Busturia;1746
País Vasco;Vizcaya;Derio;5307
País Vasco;Vizcaya;Dima;1305
País Vasco;Vizcaya;Durango;28229
País Vasco;Vizcaya;Ea;905
País Vasco;Vizcaya;Elantxobe;441
País Vasco;Vizcaya;Elorrio;7227
País Vasco;Vizcaya;Erandio;24262
País Vasco;Vizcaya;Ereño;258
País Vasco;Vizcaya;Ermua;16252
País Vasco;Vizcaya;Errigoiti;513
País Vasco;Vizcaya;Etxebarri;9171
País Vasco;Vizcaya;Etxebarria;831
País Vasco;Vizcaya;Forua;1016
País Vasco;Vizcaya;Fruiz;423
País Vasco;Vizcaya;Galdakao;29226
País Vasco;Vizcaya;Galdames;837
País Vasco;Vizcaya;Gamiz-Fika;1318
País Vasco;Vizcaya;Garai;318
País Vasco;Vizcaya;Gatika;1559
País Vasco;Vizcaya;Gautegiz Arteaga;875
País Vasco;Vizcaya;Gernika-Lumo;16244
País Vasco;Vizcaya;Getxo;80770
País Vasco;Vizcaya;Gizaburuaga;196
País Vasco;Vizcaya;Gordexola;1741
País Vasco;Vizcaya;Gorliz;5400
País Vasco;Vizcaya;Güeñes;6349
País Vasco;Vizcaya;Ibarrangelu;616
País Vasco;Vizcaya;Igorre;4238
País Vasco;Vizcaya;Ispaster;662
País Vasco;Vizcaya;Iurreta;3837
País Vasco;Vizcaya;Izurtza;258
País Vasco;Vizcaya;Karrantza Harana/Valle de Carranza;2810
País Vasco;Vizcaya;Kortezubi;412
País Vasco;Vizcaya;Lanestosa;287
País Vasco;Vizcaya;Larrabetzu;1874
País Vasco;Vizcaya;Laukiz;1082
País Vasco;Vizcaya;Leioa;30079
País Vasco;Vizcaya;Lekeitio;7477
País Vasco;Vizcaya;Lemoa;3158
País Vasco;Vizcaya;Lemoiz;1028
País Vasco;Vizcaya;Lezama;2465
País Vasco;Vizcaya;Loiu;2290
País Vasco;Vizcaya;Mallabia;1178
País Vasco;Vizcaya;Mañaria;496
País Vasco;Vizcaya;Markina-Xemein;4947
País Vasco;Vizcaya;Maruri-Jatabe;898
País Vasco;Vizcaya;Meñaka;678
País Vasco;Vizcaya;Mendata;382
País Vasco;Vizcaya;Mendexa;437
País Vasco;Vizcaya;Morga;409
País Vasco;Vizcaya;Mundaka;1933
País Vasco;Vizcaya;Mungia;16209
País Vasco;Vizcaya;Munitibar-Arbatzegi Gerrikaitz;413
País Vasco;Vizcaya;Murueta;310
País Vasco;Vizcaya;Muskiz;7216
País Vasco;Vizcaya;Muxika;1473
País Vasco;Vizcaya;Nabarniz;231
País Vasco;Vizcaya;Ondarroa;8921
País Vasco;Vizcaya;Orozko;2409
País Vasco;Vizcaya;Ortuella;8520
País Vasco;Vizcaya;Otxandio;1232
País Vasco;Vizcaya;Plentzia;4302
País Vasco;Vizcaya;Portugalete;48105
País Vasco;Vizcaya;Santurtzi;46978
País Vasco;Vizcaya;Sestao;29476
País Vasco;Vizcaya;Sondika;4536
País Vasco;Vizcaya;Sopelana;12359
País Vasco;Vizcaya;Sopuerta;2504
País Vasco;Vizcaya;Sukarrieta;350
País Vasco;Vizcaya;Trucios-Turtzioz;532
País Vasco;Vizcaya;Ubide;161
País Vasco;Vizcaya;Ugao-Miraballes;4029
País Vasco;Vizcaya;Urduliz;3338
País Vasco;Vizcaya;Urduña/Orduña;4220
País Vasco;Vizcaya;Valle de Trápaga-Trapagaran;12353
País Vasco;Vizcaya;Zaldibar;3014
País Vasco;Vizcaya;Zalla;8186
País Vasco;Vizcaya;Zamudio;3203
País Vasco;Vizcaya;Zaratamo;1735
País Vasco;Vizcaya;Zeanuri;1330
País Vasco;Vizcaya;Zeberio;1054
País Vasco;Vizcaya;Zierbena;1382
País Vasco;Vizcaya;Ziortza-Bolibar;396
Valencia;Alicante/Alacant;Adsubia;693
Valencia;Alicante/Alacant;Agost;4810
Valencia;Alicante/Alacant;Agres;619
Valencia;Alicante/Alacant;Aigües;1064
Valencia;Alicante/Alacant;Albatera;11745
Valencia;Alicante/Alacant;Alcalalí;1507
Valencia;Alicante/Alacant;Alcocer de Planes;228
Valencia;Alicante/Alacant;Alcoleja;206
Valencia;Alicante/Alacant;Alcoy/Alcoi;61552
Valencia;Alicante/Alacant;Alfafara;413
Valencia;Alicante/Alacant;Alfàs del Pi (l');21011
Valencia;Alicante/Alacant;Algorfa;4346
Valencia;Alicante/Alacant;Algueña;1551
Valencia;Alicante/Alacant;Alicante/Alacant;334757
Valencia;Alicante/Alacant;Almoradí;19147
Valencia;Alicante/Alacant;Almudaina;129
Valencia;Alicante/Alacant;Alqueria d'Asnar (l');508
Valencia;Alicante/Alacant;Altea;23780
Valencia;Alicante/Alacant;Aspe;20180
Valencia;Alicante/Alacant;Balones;163
Valencia;Alicante/Alacant;Banyeres de Mariola;7240
Valencia;Alicante/Alacant;Benasau;190
Valencia;Alicante/Alacant;Beneixama;1811
Valencia;Alicante/Alacant;Benejúzar;5467
Valencia;Alicante/Alacant;Benferri;1876
Valencia;Alicante/Alacant;Beniarbeig;1997
Valencia;Alicante/Alacant;Beniardá;238
Valencia;Alicante/Alacant;Beniarrés;1323
Valencia;Alicante/Alacant;Benidoleig;1275
Valencia;Alicante/Alacant;Benidorm;71034
Valencia;Alicante/Alacant;Benifallim;109
Valencia;Alicante/Alacant;Benifato;187
Valencia;Alicante/Alacant;Benigembla;589
Valencia;Alicante/Alacant;Benijófar;3976
Valencia;Alicante/Alacant;Benilloba;839
Valencia;Alicante/Alacant;Benillup;99
Valencia;Alicante/Alacant;Benimantell;490
Valencia;Alicante/Alacant;Benimarfull;440
Valencia;Alicante/Alacant;Benimassot;123
Valencia;Alicante/Alacant;Benimeli;402
Valencia;Alicante/Alacant;Benissa;13221
Valencia;Alicante/Alacant;Benitachell/Poble Nou de Benitatxell (el);5399
Valencia;Alicante/Alacant;Biar;3723
Valencia;Alicante/Alacant;Bigastro;6744
Valencia;Alicante/Alacant;Bolulla;433
Valencia;Alicante/Alacant;Busot;3148
Valencia;Alicante/Alacant;Callosa d'En Sarrià;8056
Valencia;Alicante/Alacant;Callosa de Segura;17924
Valencia;Alicante/Alacant;Calpe/Calp;29666
Valencia;Alicante/Alacant;Campello (el);26511
Valencia;Alicante/Alacant;Campo de Mirra/Camp de Mirra (el);424
Valencia;Alicante/Alacant;Cañada;1231
Valencia;Alicante/Alacant;Castalla;10327
Valencia;Alicante/Alacant;Castell de Castells;508
Valencia;Alicante/Alacant;Castell de Guadalest (el);231
Valencia;Alicante/Alacant;Catral;8745
Valencia;Alicante/Alacant;Cocentaina;11467
Valencia;Alicante/Alacant;Confrides;299
Valencia;Alicante/Alacant;Cox;6826
Valencia;Alicante/Alacant;Crevillent;28609
Valencia;Alicante/Alacant;Daya Nueva;1942
Valencia;Alicante/Alacant;Daya Vieja;674
Valencia;Alicante/Alacant;Dénia;44464
Valencia;Alicante/Alacant;Dolores;7427
Valencia;Alicante/Alacant;Elche/Elx;230112
Valencia;Alicante/Alacant;Elda;55168
Valencia;Alicante/Alacant;Facheca;106
Valencia;Alicante/Alacant;Famorca;44
Valencia;Alicante/Alacant;Finestrat;6137
Valencia;Alicante/Alacant;Fondó de les Neus (el)/Hondón de las Nieves;2862
Valencia;Alicante/Alacant;Formentera del Segura;4285
Valencia;Alicante/Alacant;Gaianes;378
Valencia;Alicante/Alacant;Gata de Gorgos;6291
Valencia;Alicante/Alacant;Gorga;232
Valencia;Alicante/Alacant;Granja de Rocamora;2362
Valencia;Alicante/Alacant;Guardamar del Segura;16329
Valencia;Alicante/Alacant;Hondón de los Frailes;1214
Valencia;Alicante/Alacant;Ibi;24113
Valencia;Alicante/Alacant;Jacarilla;2096
Valencia;Alicante/Alacant;Jávea/Xàbia;31593
Valencia;Alicante/Alacant;Jijona/Xixona;7516
Valencia;Alicante/Alacant;Llíber;1057
Valencia;Alicante/Alacant;Lorcha/Orxa (l');749
Valencia;Alicante/Alacant;Millena;201
Valencia;Alicante/Alacant;Monforte del Cid;7366
Valencia;Alicante/Alacant;Monóvar/Monòver;13060
Valencia;Alicante/Alacant;Montesinos (Los);4949
Valencia;Alicante/Alacant;Murla;612
Valencia;Alicante/Alacant;Muro de Alcoy;8893
Valencia;Alicante/Alacant;Mutxamel;22510
Valencia;Alicante/Alacant;Novelda;27135
Valencia;Alicante/Alacant;Nucia (la);17874
Valencia;Alicante/Alacant;Ondara;6546
Valencia;Alicante/Alacant;Onil;7771
Valencia;Alicante/Alacant;Orba;2616
Valencia;Alicante/Alacant;Orihuela;86164
Valencia;Alicante/Alacant;Orxeta;870
Valencia;Alicante/Alacant;Parcent;1081
Valencia;Alicante/Alacant;Pedreguer;7602
Valencia;Alicante/Alacant;Pego;11133
Valencia;Alicante/Alacant;Penàguila;323
Valencia;Alicante/Alacant;Petrer;34523
Valencia;Alicante/Alacant;Pilar de la Horadada;22050
Valencia;Alicante/Alacant;Pinós (el)/Pinoso;7689
Valencia;Alicante/Alacant;Planes;844
Valencia;Alicante/Alacant;Poblets (els);3288
Valencia;Alicante/Alacant;Polop;4245
Valencia;Alicante/Alacant;Quatretondeta;129
Valencia;Alicante/Alacant;Rafal;4135
Valencia;Alicante/Alacant;Ràfol d'Almúnia (El);697
Valencia;Alicante/Alacant;Redován;7335
Valencia;Alicante/Alacant;Relleu;1262
Valencia;Alicante/Alacant;Rojales;20510
Valencia;Alicante/Alacant;Romana (la);2576
Valencia;Alicante/Alacant;Sagra;444
Valencia;Alicante/Alacant;Salinas;1596
Valencia;Alicante/Alacant;San Fulgencio;12030
Valencia;Alicante/Alacant;San Isidro;1806
Valencia;Alicante/Alacant;San Miguel de Salinas;8135
Valencia;Alicante/Alacant;San Vicente del Raspeig/Sant Vicent del Raspeig;53126
Valencia;Alicante/Alacant;Sanet y Negrals;734
Valencia;Alicante/Alacant;Sant Joan d'Alacant;21939
Valencia;Alicante/Alacant;Santa Pola;31760
Valencia;Alicante/Alacant;Sax;10054
Valencia;Alicante/Alacant;Sella;652
Valencia;Alicante/Alacant;Senija;636
Valencia;Alicante/Alacant;Tàrbena;792
Valencia;Alicante/Alacant;Teulada;14620
Valencia;Alicante/Alacant;Tibi;1719
Valencia;Alicante/Alacant;Tollos;68
Valencia;Alicante/Alacant;Tormos;377
Valencia;Alicante/Alacant;Torremanzanas/Torre de les Maçanes (la);742
Valencia;Alicante/Alacant;Torrevieja;101792
Valencia;Alicante/Alacant;Vall d'Alcalà (la);192
Valencia;Alicante/Alacant;Vall d'Ebo (la);282
Valencia;Alicante/Alacant;Vall de Gallinera;664
Valencia;Alicante/Alacant;Vall de Laguar (la);987
Valencia;Alicante/Alacant;Verger (el);4865
Valencia;Alicante/Alacant;Villajoyosa/Vila Joiosa (la);33797
Valencia;Alicante/Alacant;Villena;35222
Valencia;Alicante/Alacant;Xaló;3235
Valencia;Castellón/Castelló;Aín;141
Valencia;Castellón/Castelló;Albocàsser;1447
Valencia;Castellón/Castelló;Alcalà de Xivert;7926
Valencia;Castellón/Castelló;Alcora (l');11150
Valencia;Castellón/Castelló;Alcudia de Veo;211
Valencia;Castellón/Castelló;Alfondeguilla;860
Valencia;Castellón/Castelló;Algimia de Almonacid;328
Valencia;Castellón/Castelló;Almazora/Almassora;24963
Valencia;Castellón/Castelló;Almedíjar;252
Valencia;Castellón/Castelló;Almenara;5926
Valencia;Castellón/Castelló;Alquerías del Niño Perdido;4284
Valencia;Castellón/Castelló;Altura;3920
Valencia;Castellón/Castelló;Arañuel;199
Valencia;Castellón/Castelló;Ares del Maestre;216
Valencia;Castellón/Castelló;Argelita;111
Valencia;Castellón/Castelló;Artana;1969
Valencia;Castellón/Castelló;Atzeneta del Maestrat;1424
Valencia;Castellón/Castelló;Ayódar;234
Valencia;Castellón/Castelló;Azuébar;336
Valencia;Castellón/Castelló;Barracas;184
Valencia;Castellón/Castelló;Bejís;427
Valencia;Castellón/Castelló;Benafer;180
Valencia;Castellón/Castelló;Benafigos;169
Valencia;Castellón/Castelló;Benasal;1340
Valencia;Castellón/Castelló;Benicarló;26655
Valencia;Castellón/Castelló;Benicasim/Benicàssim;18098
Valencia;Castellón/Castelló;Benlloch;1175
Valencia;Castellón/Castelló;Betxí;5902
Valencia;Castellón/Castelló;Borriana/Burriana;34565
Valencia;Castellón/Castelló;Borriol;5025
Valencia;Castellón/Castelló;Cabanes;3128
Valencia;Castellón/Castelló;Càlig;2198
Valencia;Castellón/Castelló;Canet lo Roig;882
Valencia;Castellón/Castelló;Castell de Cabres;18
Valencia;Castellón/Castelló;Castellfort;236
Valencia;Castellón/Castelló;Castellnovo;1081
Valencia;Castellón/Castelló;Castellón de la Plana/Castelló de la Plana;180005
Valencia;Castellón/Castelló;Castillo de Villamalefa;109
Valencia;Castellón/Castelló;Catí;859
Valencia;Castellón/Castelló;Caudiel;712
Valencia;Castellón/Castelló;Cervera del Maestre;730
Valencia;Castellón/Castelló;Chert/Xert;906
Valencia;Castellón/Castelló;Chilches/Xilxes;2872
Valencia;Castellón/Castelló;Chodos/Xodos;126
Valencia;Castellón/Castelló;Chóvar;347
Valencia;Castellón/Castelló;Cinctorres;498
Valencia;Castellón/Castelló;Cirat;267
Valencia;Castellón/Castelló;Cortes de Arenoso;349
Valencia;Castellón/Castelló;Costur;574
Valencia;Castellón/Castelló;Coves de Vinromà (les);2052
Valencia;Castellón/Castelló;Culla;637
Valencia;Castellón/Castelló;Eslida;915
Valencia;Castellón/Castelló;Espadilla;75
Valencia;Castellón/Castelló;Fanzara;400
Valencia;Castellón/Castelló;Figueroles;584
Valencia;Castellón/Castelló;Forcall;527
Valencia;Castellón/Castelló;Fuente la Reina;56
Valencia;Castellón/Castelló;Fuentes de Ayódar;122
Valencia;Castellón/Castelló;Gaibiel;201
Valencia;Castellón/Castelló;Geldo;706
Valencia;Castellón/Castelló;Herbés;59
Valencia;Castellón/Castelló;Higueras;51
Valencia;Castellón/Castelló;Jana (la);820
Valencia;Castellón/Castelló;Jérica;1672
Valencia;Castellón/Castelló;Llosa (la);962
Valencia;Castellón/Castelló;Lucena del Cid;1585
Valencia;Castellón/Castelló;Ludiente;192
Valencia;Castellón/Castelló;Mata de Morella (la);192
Valencia;Castellón/Castelló;Matet;113
Valencia;Castellón/Castelló;Moncofa;6014
Valencia;Castellón/Castelló;Montán;431
Valencia;Castellón/Castelló;Montanejos;617
Valencia;Castellón/Castelló;Morella;2822
Valencia;Castellón/Castelló;Navajas;787
Valencia;Castellón/Castelló;Nules;13490
Valencia;Castellón/Castelló;Olocau del Rey;138
Valencia;Castellón/Castelló;Onda;25691
Valencia;Castellón/Castelló;Oropesa del Mar/Orpesa;11188
Valencia;Castellón/Castelló;Palanques;35
Valencia;Castellón/Castelló;Pavías;61
Valencia;Castellón/Castelló;Peníscola/Peñíscola;7894
Valencia;Castellón/Castelló;Pina de Montalgrao;147
Valencia;Castellón/Castelló;Pobla de Benifassà (la);296
Valencia;Castellón/Castelló;Pobla Tornesa (la);1106
Valencia;Castellón/Castelló;Portell de Morella;254
Valencia;Castellón/Castelló;Puebla de Arenoso;202
Valencia;Castellón/Castelló;Ribesalbes;1373
Valencia;Castellón/Castelló;Rossell;1187
Valencia;Castellón/Castelló;Sacañet;85
Valencia;Castellón/Castelló;Salzadella (la);838
Valencia;Castellón/Castelló;San Rafael del Río;546
Valencia;Castellón/Castelló;Sant Joan de Moró;2893
Valencia;Castellón/Castelló;Sant Jordi/San Jorge;1042
Valencia;Castellón/Castelló;Sant Mateu;2187
Valencia;Castellón/Castelló;Santa Magdalena de Pulpis;873
Valencia;Castellón/Castelló;Sarratella;100
Valencia;Castellón/Castelló;Segorbe;9244
Valencia;Castellón/Castelló;Sierra Engarcerán;1039
Valencia;Castellón/Castelló;Soneja;1525
Valencia;Castellón/Castelló;Sot de Ferrer;460
Valencia;Castellón/Castelló;Sueras/Suera;654
Valencia;Castellón/Castelló;Tales;883
Valencia;Castellón/Castelló;Teresa;297
Valencia;Castellón/Castelló;Tírig;554
Valencia;Castellón/Castelló;Todolella;149
Valencia;Castellón/Castelló;Toga;112
Valencia;Castellón/Castelló;Torás;245
Valencia;Castellón/Castelló;Toro (El);292
Valencia;Castellón/Castelló;Torralba del Pinar;62
Valencia;Castellón/Castelló;Torre d'En Besora (la);185
Valencia;Castellón/Castelló;Torre d'en Doménec (la);236
Valencia;Castellón/Castelló;Torreblanca;6115
Valencia;Castellón/Castelló;Torrechiva;91
Valencia;Castellón/Castelló;Traiguera;1695
Valencia;Castellón/Castelló;Useras/Useres (les);1005
Valencia;Castellón/Castelló;Vall d'Alba;2951
Valencia;Castellón/Castelló;Vall d'Uixó (la);32924
Valencia;Castellón/Castelló;Vall de Almonacid;267
Valencia;Castellón/Castelló;Vallat;78
Valencia;Castellón/Castelló;Vallibona;90
Valencia;Castellón/Castelló;Vila-real;51205
Valencia;Castellón/Castelló;Vilafamés;2017
Valencia;Castellón/Castelló;Vilanova d'Alcolea;698
Valencia;Castellón/Castelló;Vilar de Canes;175
Valencia;Castellón/Castelló;Vilavella (la);3397
Valencia;Castellón/Castelló;Villafranca del Cid/Vilafranca;2521
Valencia;Castellón/Castelló;Villahermosa del Río;429
Valencia;Castellón/Castelló;Villamalur;92
Valencia;Castellón/Castelló;Villanueva de Viver;64
Valencia;Castellón/Castelló;Villores;51
Valencia;Castellón/Castelló;Vinaròs;28273
Valencia;Castellón/Castelló;Vistabella del Maestrazgo;412
Valencia;Castellón/Castelló;Viver;1754
Valencia;Castellón/Castelló;Zorita del Maestrazgo;146
Valencia;Castellón/Castelló;Zucaina;182
Valencia;Valencia/València;Ademuz;1286
Valencia;Valencia/València;Ador;1474
Valencia;Valencia/València;Agullent;2449
Valencia;Valencia/València;Aielo de Malferit;4679
Valencia;Valencia/València;Aielo de Rugat;189
Valencia;Valencia/València;Alaquàs;30392
Valencia;Valencia/València;Albaida;6449
Valencia;Valencia/València;Albal;15443
Valencia;Valencia/València;Albalat de la Ribera;3590
Valencia;Valencia/València;Albalat dels Sorells;3849
Valencia;Valencia/València;Albalat dels Tarongers;1113
Valencia;Valencia/València;Alberic;11175
Valencia;Valencia/València;Alborache;1209
Valencia;Valencia/València;Alboraya;22405
Valencia;Valencia/València;Albuixech;3880
Valencia;Valencia/València;Alcàntera de Xúquer;1444
Valencia;Valencia/València;Alcàsser;9103
Valencia;Valencia/València;Alcublas;818
Valencia;Valencia/València;Alcúdia (l');11378
Valencia;Valencia/València;Alcúdia de Crespins (l');5230
Valencia;Valencia/València;Aldaia;29914
Valencia;Valencia/València;Alfafar;20853
Valencia;Valencia/València;Alfara de Algimia;538
Valencia;Valencia/València;Alfara del Patriarca;3032
Valencia;Valencia/València;Alfarp;1543
Valencia;Valencia/València;Alfarrasí;1296
Valencia;Valencia/València;Alfauir;451
Valencia;Valencia/València;Algar de Palancia;558
Valencia;Valencia/València;Algemesí;28308
Valencia;Valencia/València;Algimia de Alfara;1086
Valencia;Valencia/València;Alginet;13226
Valencia;Valencia/València;Almàssera;7135
Valencia;Valencia/València;Almiserà;301
Valencia;Valencia/València;Almoines;2395
Valencia;Valencia/València;Almussafes;8300
Valencia;Valencia/València;Alpuente;805
Valencia;Valencia/València;Alqueria de la Comtessa (l');1492
Valencia;Valencia/València;Alzira;44690
Valencia;Valencia/València;Andilla;316
Valencia;Valencia/València;Anna;2774
Valencia;Valencia/València;Antella;1498
Valencia;Valencia/València;Aras de los Olmos;435
Valencia;Valencia/València;Atzeneta d'Albaida;1282
Valencia;Valencia/València;Ayora;5444
Valencia;Valencia/València;Barx;1477
Valencia;Valencia/València;Barxeta;1669
Valencia;Valencia/València;Bèlgida;716
Valencia;Valencia/València;Bellreguard;4736
Valencia;Valencia/València;Bellús;374
Valencia;Valencia/València;Benagéber;142
Valencia;Valencia/València;Benaguasil;11011
Valencia;Valencia/València;Benavites;637
Valencia;Valencia/València;Beneixida;703
Valencia;Valencia/València;Benetússer;15313
Valencia;Valencia/València;Beniarjó;1783
Valencia;Valencia/València;Beniatjar;256
Valencia;Valencia/València;Benicolet;630
Valencia;Valencia/València;Benicull de Xúquer;993
Valencia;Valencia/València;Benifaió;12204
Valencia;Valencia/València;Benifairó de la Valldigna;1683
Valencia;Valencia/València;Benifairó de les Valls;2137
Valencia;Valencia/València;Beniflá;407
Valencia;Valencia/València;Benigánim;6469
Valencia;Valencia/València;Benimodo;2268
Valencia;Valencia/València;Benimuslem;618
Valencia;Valencia/València;Beniparrell;1949
Valencia;Valencia/València;Benirredrà;1642
Valencia;Valencia/València;Benisanó;2224
Valencia;Valencia/València;Benissoda;372
Valencia;Valencia/València;Benisuera;193
Valencia;Valencia/València;Bétera;20740
Valencia;Valencia/València;Bicorp;583
Valencia;Valencia/València;Bocairent;4541
Valencia;Valencia/València;Bolbaite;1439
Valencia;Valencia/València;Bonrepòs i Mirambell;3358
Valencia;Valencia/València;Bufali;187
Valencia;Valencia/València;Bugarra;867
Valencia;Valencia/València;Buñol;10062
Valencia;Valencia/València;Burjassot;38433
Valencia;Valencia/València;Calles;448
Valencia;Valencia/València;Camporrobles;1439
Valencia;Valencia/València;Canals;13941
Valencia;Valencia/València;Canet d'En Berenguer;5569
Valencia;Valencia/València;Carcaixent;21735
Valencia;Valencia/València;Càrcer;2109
Valencia;Valencia/València;Carlet;15527
Valencia;Valencia/València;Carrícola;90
Valencia;Valencia/València;Casas Altas;182
Valencia;Valencia/València;Casas Bajas;235
Valencia;Valencia/València;Casinos;2585
Valencia;Valencia/València;Castelló de Rugat;2433
Valencia;Valencia/València;Castellonet de la Conquesta;153
Valencia;Valencia/València;Castielfabib;365
Valencia;Valencia/València;Catadau;2729
Valencia;Valencia/València;Catarroja;27035
Valencia;Valencia/València;Caudete de las Fuentes;800
Valencia;Valencia/València;Cerdà;379
Valencia;Valencia/València;Chella;2807
Valencia;Valencia/València;Chelva;1782
Valencia;Valencia/València;Chera;611
Valencia;Valencia/València;Cheste;8270
Valencia;Valencia/València;Chiva;14167
Valencia;Valencia/València;Chulilla;779
Valencia;Valencia/València;Cofrentes;947
Valencia;Valencia/València;Corbera;3325
Valencia;Valencia/València;Cortes de Pallás;909
Valencia;Valencia/València;Cotes;393
Valencia;Valencia/València;Cullera;24121
Valencia;Valencia/València;Daimús;3068
Valencia;Valencia/València;Domeño;735
Valencia;Valencia/València;Dos Aguas;434
Valencia;Valencia/València;Eliana (l');16552
Valencia;Valencia/València;Emperador;586
Valencia;Valencia/València;Enguera;5902
Valencia;Valencia/València;Ènova (l');1018
Valencia;Valencia/València;Estivella;1352
Valencia;Valencia/València;Estubeny;144
Valencia;Valencia/València;Faura;3535
Valencia;Valencia/València;Favara;2265
Valencia;Valencia/València;Foios;6671
Valencia;Valencia/València;Font d'En Carròs (la);4178
Valencia;Valencia/València;Font de la Figuera (la);2224
Valencia;Valencia/València;Fontanars dels Alforins;1024
Valencia;Valencia/València;Fortaleny;997
Valencia;Valencia/València;Fuenterrobles;733
Valencia;Valencia/València;Gandia;80020
Valencia;Valencia/València;Gátova;448
Valencia;Valencia/València;Gavarda;1162
Valencia;Valencia/València;Genovés;2791
Valencia;Valencia/València;Gestalgar;718
Valencia;Valencia/València;Gilet;2983
Valencia;Valencia/València;Godella;13240
Valencia;Valencia/València;Godelleta;3329
Valencia;Valencia/València;Granja de la Costera (la);341
Valencia;Valencia/València;Guadasequies;447
Valencia;Valencia/València;Guadassuar;6163
Valencia;Valencia/València;Guardamar de la Safor;358
Valencia;Valencia/València;Higueruelas;523
Valencia;Valencia/València;Jalance;1012
Valencia;Valencia/València;Jarafuel;816
Valencia;Valencia/València;Llanera de Ranes;1107
Valencia;Valencia/València;Llaurí;1313
Valencia;Valencia/València;Llíria;22706
Valencia;Valencia/València;Llocnou d'En Fenollet;854
Valencia;Valencia/València;Llocnou de la Corona;124
Valencia;Valencia/València;Llocnou de Sant Jeroni;582
Valencia;Valencia/València;Llombai;2811
Valencia;Valencia/València;Llosa de Ranes (la);3968
Valencia;Valencia/València;Llutxent;2588
Valencia;Valencia/València;Loriguilla;1433
Valencia;Valencia/València;Losa del Obispo;557
Valencia;Valencia/València;Macastre;1331
Valencia;Valencia/València;Manises;30508
Valencia;Valencia/València;Manuel;2670
Valencia;Valencia/València;Marines;1771
Valencia;Valencia/València;Masalavés;1665
Valencia;Valencia/València;Massalfassar;2215
Valencia;Valencia/València;Massamagrell;15210
Valencia;Valencia/València;Massanassa;8968
Valencia;Valencia/València;Meliana;10395
Valencia;Valencia/València;Millares;502
Valencia;Valencia/València;Miramar;2333
Valencia;Valencia/València;Mislata;43756
Valencia;Valencia/València;Mogente/Moixent;4734
Valencia;Valencia/València;Moncada;21900
Valencia;Valencia/València;Montaverner;1824
Valencia;Valencia/València;Montesa;1390
Valencia;Valencia/València;Montitxelvo/Montichelvo;654
Valencia;Valencia/València;Montroy;2804
Valencia;Valencia/València;Montserrat;6421
Valencia;Valencia/València;Museros;5623
Valencia;Valencia/València;Náquera;5680
Valencia;Valencia/València;Navarrés;3238
Valencia;Valencia/València;Novelé/Novetlè;832
Valencia;Valencia/València;Oliva;28419
Valencia;Valencia/València;Olleria (l');8692
Valencia;Valencia/València;Olocau;1479
Valencia;Valencia/València;Ontinyent;37735
Valencia;Valencia/València;Otos;495
Valencia;Valencia/València;Paiporta;23519
Valencia;Valencia/València;Palma de Gandía;1887
Valencia;Valencia/València;Palmera;947
Valencia;Valencia/València;Palomar (el);572
Valencia;Valencia/València;Paterna;64023
Valencia;Valencia/València;Pedralba;2831
Valencia;Valencia/València;Petrés;973
Valencia;Valencia/València;Picanya;11053
Valencia;Valencia/València;Picassent;19786
Valencia;Valencia/València;Piles;2878
Valencia;Valencia/València;Pinet;194
Valencia;Valencia/València;Pobla de Farnals (la);7340
Valencia;Valencia/València;Pobla de Vallbona (la);20431
Valencia;Valencia/València;Pobla del Duc (la);2561
Valencia;Valencia/València;Pobla Llarga (la);4577
Valencia;Valencia/València;Polinyà de Xúquer;2492
Valencia;Valencia/València;Potríes;1028
Valencia;Valencia/València;Puçol;19018
Valencia;Valencia/València;Puebla de San Miguel;97
Valencia;Valencia/València;Puig;8670
Valencia;Valencia/València;Quart de les Valls;1083
Valencia;Valencia/València;Quart de Poblet;25499
Valencia;Valencia/València;Quartell;1468
Valencia;Valencia/València;Quatretonda;2513
Valencia;Valencia/València;Quesa;738
Valencia;Valencia/València;Rafelbuñol/Rafelbunyol;8067
Valencia;Valencia/València;Rafelcofer;1510
Valencia;Valencia/València;Rafelguaraf;2483
Valencia;Valencia/València;Ráfol de Salem;449
Valencia;Valencia/València;Real de Gandía;2184
Valencia;Valencia/València;Real de Montroi;2329
Valencia;Valencia/València;Requena;21278
Valencia;Valencia/València;Riba-roja de Túria;20468
Valencia;Valencia/València;Riola;1829
Valencia;Valencia/València;Rocafort;6640
Valencia;Valencia/València;Rotglà i Corberà;1235
Valencia;Valencia/València;Rótova;1335
Valencia;Valencia/València;Rugat;186
Valencia;Valencia/València;Sagunto/Sagunt;66070
Valencia;Valencia/València;Salem;486
Valencia;Valencia/València;San Antonio de Benagéber;5746
Valencia;Valencia/València;Sant Joan de l'Ènova;474
Valencia;Valencia/València;Sedaví;9913
Valencia;Valencia/València;Segart;134
Valencia;Valencia/València;Sellent;437
Valencia;Valencia/València;Sempere;37
Valencia;Valencia/València;Senyera;1200
Valencia;Valencia/València;Serra;3074
Valencia;Valencia/València;Siete Aguas;1427
Valencia;Valencia/València;Silla;18979
Valencia;Valencia/València;Simat de la Valldigna;3700
Valencia;Valencia/València;Sinarcas;1217
Valencia;Valencia/València;Sollana;4913
Valencia;Valencia/València;Sot de Chera;405
Valencia;Valencia/València;Sueca;28908
Valencia;Valencia/València;Sumacàrcer;1286
Valencia;Valencia/València;Tavernes Blanques;9351
Valencia;Valencia/València;Tavernes de la Valldigna;18195
Valencia;Valencia/València;Teresa de Cofrentes;727
Valencia;Valencia/València;Terrateig;337
Valencia;Valencia/València;Titaguas;525
Valencia;Valencia/València;Torrebaja;444
Valencia;Valencia/València;Torrella;148
Valencia;Valencia/València;Torrent;78543
Valencia;Valencia/València;Torres Torres;588
Valencia;Valencia/València;Tous;1260
Valencia;Valencia/València;Tuéjar;1236
Valencia;Valencia/València;Turís;6499
Valencia;Valencia/València;Utiel;12420
Valencia;Valencia/València;Valencia;814208
Valencia;Valencia/València;Vallada;3463
Valencia;Valencia/València;Vallanca;155
Valencia;Valencia/València;Vallés;145
Valencia;Valencia/València;Venta del Moro;1497
Valencia;Valencia/València;Vilamarxant;8767
Valencia;Valencia/València;Villalonga;4369
Valencia;Valencia/València;Villanueva de Castellón;7748
Valencia;Valencia/València;Villar del Arzobispo;3894
Valencia;Valencia/València;Villargordo del Cabriel;685
Valencia;Valencia/València;Vinalesa;3123
Valencia;Valencia/València;Xàtiva;29386
Valencia;Valencia/València;Xeraco;6186
Valencia;Valencia/València;Xeresa;2221
Valencia;Valencia/València;Xirivella;30691
Valencia;Valencia/València;Yátova;2199
Valencia;Valencia/València;Yesa (La);260
Valencia;Valencia/València;Zarra;551
`;

export default raw;
