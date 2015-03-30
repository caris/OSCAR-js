

/* define lexicon */

%lex
%%

\s+	{}
"AND"	{return "AND"}
"OR"	{return "OR"}
"NEQ"|"<>"	{return "NEQ"}
"LTE"|"<="	{return "LTE"}
"GTE"|">="	{return "GTE"}
"LT"|"<"	{return "LT"}
"GT"|">"	{return "GT"}
"LIKE"|"~"	{return "LIKE"}
"EQUALS"|"="	{return "EQUALS"}
(["']).*?\1(?=\s+AND|\s+OR|\s*\)|\s*$) {return "WORD"}
"("                   { return "OPEN" }
")"                   { return "CLOSE" }
^[_a-zA-Z:-]*\w {return 'FIELD'}
^[_a-zA-Z]*\w {return 'FIELD'}
<<EOF>>	{return "EOF"}

/lex


/* Operators */

%right AND OR
%start START

/* define grammar */

%%

START : EXP EOF { return $1};

EXP : 
	EXP AND EXP {$$ = function(obj){ return ($1(obj) && $3(obj));};}
	| EXP OR EXP {$$ = function(obj){return ($1(obj) || $3(obj));};}
	| FIELD LIKE WORD { $$ = function(obj){return $1(obj) + $2(obj) + $3(obj)};}
	| FIELD EQUALS WORD { $$ = function(obj){return $1(obj)};}
	| FIELD LT WORD { $$ = function(obj){return $1(obj)};}
	| FIELD LTE WORD { $$ = function(obj){return $1(obj)};}
	| FIELD GT WORD { $$ = function(obj){return $1(obj)};}
	| FIELD GTE WORD { $$ = function(obj){return $1(obj)};}
	| FIELD NEQ WORD { $$ = function(obj){return $1(obj)};}
	| OPEN EXP CLOSE { $$ = $2; }
    | ARGS
        { $$ = function(obj) { return parser.processArgs(obj, $1)(obj); }; }	
	;