library(openxlsx2)
library(dplyr)
library(magrittr)
library(tidyverse)

curr_path = rstudioapi::getSourceEditorContext()$path
curr_path <- sub("/[^/]*$", "", curr_path)
books <- openxlsx2::read_xlsx(paste0(curr_path,"/","workshop_data.xlsx"))

books %<>% arrange(std_call_number)

books %<>% nest(.by = c(topic,sub_topic))
