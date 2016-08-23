
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.util.Iterator;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.hssf.record.EscherAggregate;
import org.apache.poi.ddf.EscherRecord;
import org.apache.poi.ddf.EscherRecordFactory;
import org.apache.poi.hslf.model.Shape;
import org.apache.poi.ddf.DefaultEscherRecordFactory;
import org.apache.poi.ddf.EscherBSERecord;
import org.apache.poi.ddf.EscherBlipRecord;
import org.apache.poi.ddf.EscherClientAnchorRecord;
import org.apache.poi.ddf.EscherContainerRecord;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.ss.usermodel.PictureData;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hwpf.usermodel.Picture;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFClientAnchor;
import org.apache.poi.hssf.usermodel.HSSFPicture;
import org.apache.poi.hssf.usermodel.HSSFPictureData;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFShape;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;

/**
 *
 * @author win user
 */
public class Main {

    private ArrayList<File> excelFiles = null;   
  
    
    private List<Map<String, Object>> getPictureAndPosition(String folderName){
//    	int idColumn = ...;
//    	int pictureColumn = ...;
    	HSSFSheet sheet = null;
        List<Map<String, Object>> pictureList = null;
    	try{
    	 File fileFolder = new File(folderName);
         File[] excelWorkbooks = fileFolder.listFiles(new
 ExcelFilenameFilter());
         for(File excelWorkbook : excelWorkbooks) {
             Workbook workbook = WorkbookFactory.create(new
 FileInputStream(excelWorkbook));
             if(workbook instanceof HSSFWorkbook) {
                 int numSheets = workbook.getNumberOfSheets();
                 for(int i = 0; i < numSheets; i++) {
                     System.out.println("Processing sheet number: " + (i + 1));
                     sheet = (HSSFSheet) workbook.getSheetAt(i);
                     for (HSSFShape shape : sheet.getDrawingPatriarch().getChildren()) {
                 	    if (shape instanceof HSSFPicture) {
                 	        HSSFPicture picture = (HSSFPicture) shape;
                 	        HSSFClientAnchor anchor = (HSSFClientAnchor) picture.getAnchor();

                 	        // Ensure to use only relevant pictures
//                 	        if (anchor.getCol1() ) {

                 	            // Use the row from the anchor
                 	            HSSFRow pictureRow = sheet.getRow(anchor.getRow1());
                 	            if (pictureRow != null) {
                 	                HSSFCell idCell = pictureRow.getCell(anchor.getCol2());
                 	                if (idCell != null) {
//                 	                    long employeeId = (long) idCell.getNumericCellValue();
                 	                    HSSFPictureData pictureData =  picture.getPictureData();
	                 	  		        String ext = pictureData.suggestFileExtension();
	                 	  		        byte[] data = pictureData.getData();

	                 	                 Map<String,Object> imageWithCell = new HashMap<>();
	                 	                 imageWithCell.put("row", anchor.getRow1());
	                 	                 imageWithCell.put("column", anchor.getCol2());
	                 	                 imageWithCell.put("picture", anchor.getRow1()+"-"+anchor.getCol2()+"-"+picture.getFileName()+"."+pictureData.suggestFileExtension());
	                 	                 pictureList.add(imageWithCell);
	                 	  		          FileOutputStream out = new FileOutputStream("uploads/"+anchor.getRow1()+"-"+anchor.getCol2()+"-"+picture.getFileName()+"."+pictureData.suggestFileExtension());
	                 	  		          out.write(data);
	                 	  		          out.close();
//                 	                    myUserService.updatePortrait(employeeId, picture.getPictureData());
                 	                }
                 	            }
//                 	        }
                 	    }
                 	}
                 }
             }
         }
    	}catch(Exception e){
    		System.out.println("Error--->"+e);
    	}
    	
    	return pictureList;
    }


   
    /**
     * @param args the command line arguments
     */
//    public static void main(String[] args) {
//        try {
////            new Main().getImageMatrices("Innova 40K & 10K SOP Final -version 2.xls");
//            new Main().getPictureAndPosition("G:/Janani/Toyota/table_design");
//        }
//        catch(Exception ex) {
//            System.out.println("Caught an: " + ex.getClass().getName());
//            System.out.println("Message: " + ex.getMessage());
//            System.out.println("Stacktrace follows:.....");
//            ex.printStackTrace(System.out);
//        }
//    }
    
    public Main(){
    	try {
//          new Main().getImageMatrices("Innova 40K & 10K SOP Final -version 2.xls");
          getPictureAndPosition("../../public/uploads");
      }
      catch(Exception ex) {
          System.out.println("Caught an: " + ex.getClass().getName());
          System.out.println("Message: " + ex.getMessage());
          System.out.println("Stacktrace follows:.....");
          ex.printStackTrace(System.out);
      }
    }

    public class ExcelFilenameFilter implements FilenameFilter {

        public boolean accept(File file, String fileName) {
            boolean includeFile = false;
            if(fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) {
                includeFile = true;
            }
            return(includeFile);
        }
    }
}
