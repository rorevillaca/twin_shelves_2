library(openxlsx2)
library(dplyr)
library(magrittr)
library(tidyverse)
library(jsonlite)


curr_path = rstudioapi::getSourceEditorContext()$path
curr_path <- sub("/[^/]*$", "", curr_path)
books <- openxlsx2::read_xlsx(paste0(curr_path,"/","workshop_data.xlsx"))


books_json <- books %>% 
  select(title,authors,year,OCLC,description,std_call_number,floor,cover_file,shelf) %>% 
  toJSON(pretty = TRUE, auto_unbox = TRUE)
#write(books_json, file = paste0(curr_path,"/","workshop_data.js"))


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
