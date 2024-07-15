library(openxlsx2)
library(dplyr)
library(magrittr)
library(tidyverse)
library(jsonlite)


curr_path = rstudioapi::getSourceEditorContext()$path
curr_path <- sub("/[^/]*$", "", curr_path)
books <- openxlsx2::read_xlsx(paste0(curr_path,"/","workshop_data.xlsx"))

books %<>% arrange(std_call_number)



books %<>% group_by(topic,sub_topic) %>% mutate(book_no = row_number()) %>% ungroup()
books %<>% mutate(virtual_shelf_temp = ((book_no -1 ) %/% 25)+1)
books %<>% group_by(sub_topic, virtual_shelf_temp) %>% mutate(virtual_shelf = cur_group_id()) %>% ungroup()
books %<>% select(topic,sub_topic,OCLC,cover_file,virtual_shelf)

#abooks %<>% nest(.by = c(topic,virtual_shelf))

books$cover_file[is.na(books$cover_file)] <- "NA"


json_data <- books %>%
  group_by(topic, sub_topic, virtual_shelf) %>%
  summarise(
    books_in_bookcase = n(),
    books = list(data.frame(OCLC, cover_file))
  ) %>%
  ungroup() %>%
  rowwise()

# Convert the list to JSON
json_output <- toJSON(json_data, pretty = TRUE, auto_unbox = TRUE)

write(json_output, file = paste0(curr_path,"/","virtual_bookshelves.json"))
