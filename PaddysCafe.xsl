<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="/">
    <script src="js/PaddysCafeCode.js"></script>
    
    <script>
  		
			            document.forms[1].txtBillAmt.value = calculateBill('menuTable');
			            document.querySelector("#calcBill").addEventListener("click", function() {
			                document.forms[1].txtBillAmt.value = calculateBill('menuTable');
			            });
			            document.querySelector("#showVeg").addEventListener("click", function() {
			                highlightVegetarian("menuTable", this.checked);
                        });
                        

			       
       </script>
       
                <table id="menuTable" class="indent">
                    <thead>
                        <tr>
                            <th colspan="3">Paddy's Cafe Menu</th>
                        </tr>
                        <tr>
                            <th>Select</th>
                            <th>Item</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <xsl:for-each select="/cafemenu/section">
                            <tr>
                                <td colspan="3">
                                    <xsl:value-of select="@name" />
                                </td>
                            </tr>
                            <xsl:for-each select="entree">
                                <tr id="{position()}">
                                    <xsl:attribute name="vegetarian">
                                        <xsl:value-of select="boolean(./@vegetarian)" />
                                    </xsl:attribute>
                                    <td align="center">
                                        <input name="item0" type="checkbox" />
                                    </td>
                                    <td>
                                        <xsl:value-of select="item" />
                                    </td>
                                    <td align="right">
                                        <xsl:value-of select="price" />
                                    </td>
                                </tr>
                            </xsl:for-each>
                        </xsl:for-each>
                    </tbody>
                </table><br/>

<div class="col-lg-4 text-center order-2">
            <form enctype="application/json" action="/post/json" method="post">
                <div class="form-group">
                    <select class="form-control" name="sec_n">
                        <option value="0">Side Dishes</option>
                        <option value="1">Breakfast</option>
                        <option value="2">Lunch</option>
                        <option value="3">Dinner</option>
                    </select>
                </div>
                <div class="form-group">
                    <input class="form-control" type="text" name="item" placeholder="Item" />
                </div>
                <div class="form-group">
                    <input class="form-control" type="text" name="price" placeholder="Price" />
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
<div class="container">
<button id="delete" class="btn btn-block btn-danger">Delete</button>
                    <p class="text-muted">To delete an entree, click the required row first</p>

</div>
           

</div>

<div class="col-lg-14 text-right order-2">

    <form class="" id="calc">
        <p>
            <button type="button" class="btn btn-primary" name="btnCalcBill" value="Calculate Bill" id="calcBill">Calculate Bill</button>
            Total: €
            <input type="text" name="txtBillAmt" />
            <input type="checkbox" name="cbOpts" value="isVeg" id="showVeg" />
            <label for="showVeg">Highlight Vegetarian Meals</label></p>
    </form>
</div>

    </xsl:template>
</xsl:stylesheet>