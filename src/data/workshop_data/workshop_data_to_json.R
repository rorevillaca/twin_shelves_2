library(openxlsx2)
library(dplyr)
library(magrittr)
library(tidyverse)
library(jsonlite)


get_dissertation_data <- function() {
  final_names_1 <- read.csv2("C:/Users/Revi/Desktop/Github/DistributedDisplays/topic_modelling/15_shelves/theses_1_by_callnumber.csv",
                             sep = ",")
  final_names_2 <- read.csv2("C:/Users/Revi/Desktop/Github/DistributedDisplays/topic_modelling/15_shelves/theses_2_by_callnumber.csv",
                             sep = ",")
  all_names <- final_names_1 %>% bind_rows(final_names_2)
  metadata <- read.csv2("C:/Users/Revi/Desktop/Github/DistributedDisplays/collections_overview/all_relevant_theses_metadata.csv",
                        sep = ",") %>% group_by(Title) %>% slice_head(n = 1)
  all_names %<>% left_join(metadata, by=c("title"="Title"))
  all_names %<>% mutate(OCLC=substr(link,79,90))
  all_names %<>% select(title,authors = Author,
                        year = year_final,
                        description = Abstract,
                        std_call_number = call_numbers,
                        OCLC,
                        sub_topic = topic)
  all_names %<>% mutate(shelf = 1072,
                        floor=1,
                        topic_id = "dissertations",
                        topic = "Dissertations",
                        year = as.character(year),
                        std_call_number = stringr::str_replace_all(std_call_number," ",""),
                        std_call_number = toupper(std_call_number))
  return(all_names)
}


curr_path = rstudioapi::getSourceEditorContext()$path
curr_path <- sub("/[^/]*$", "", curr_path)
books <- openxlsx2::read_xlsx(paste0(curr_path,"/","workshop_data.xlsx"))
recommended_books <- openxlsx2::read_xlsx(paste0(curr_path,"/","recommended_books.xlsx"))
dissertations <- get_dissertation_data()

recommended_books %<>% mutate(
                        topic = "Book Recommendations", 
                        topic_id = "recommended_books",
                        year = as.character(year),
                        std_call_number = as.character(std_call_number),
                        cover_file = ifelse(!is.na(cover_file),paste0("_recommended_books/cover_",cover_file),NA)) %>% 
                      rename(
                        sub_topic = recommender, 
                        OCLC = unique_id)

recommended_books %<>% filter(sub_topic != "Willemijn Elkhuizen") 

books %<>%  bind_rows(dissertations)
books %<>%  bind_rows(recommended_books)

books_json <- books  %>% 
  select(title,authors,year,OCLC,description,std_call_number,floor,cover_file,shelf) %>% 
  toJSON(pretty = TRUE, auto_unbox = TRUE)
write(books_json, file = paste0(curr_path,"/","workshop_data.js"))


books %<>% arrange(std_call_number)

books %<>% mutate(floor = case_when(shelf <= 180 ~ 4,
                                   shelf <= 474 ~ 3,
                                   shelf <= 774 ~ 2,
                                   TRUE         ~ 1))

books %<>% group_by(topic,sub_topic) %>% mutate(book_no = row_number()) %>% ungroup()
books %<>% mutate(book_no = book_no + 5) #This makes the first shelf smaller, leaving room for the subtopic section tag 
books %<>% mutate(virtual_shelf_temp = ((book_no -1 ) %/% 25)+1)
#books %<>% group_by(sub_topic, virtual_shelf_temp) %>% mutate(virtual_shelf = cur_group_id()) %>% ungroup()
books %<>% select(topic, topic_id,sub_topic,OCLC,cover_file,virtual_shelf_temp)

#abooks %<>% nest(.by = c(topic,virtual_shelf))

books$cover_file[is.na(books$cover_file)] <- "NA"


json_data <- books %>%
  group_by(topic, topic_id, sub_topic, virtual_shelf_temp) %>%
  summarise(
    books_in_bookcase = n(),
    books = list(data.frame(OCLC, cover_file))
  ) %>%
  ungroup() %>%
  rowwise()

# Convert the list to JSON
json_output <- toJSON(json_data, pretty = TRUE, auto_unbox = TRUE)

write(json_output, file = paste0(curr_path,"/","virtual_bookshelves.js"))
